import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAblyRest } from '@/lib/ably';

/**
 * GET /api/play/claim?code=...&participantId=...
 * Query ticket status, metadata, and trivia challenge without revealing the answer.
 */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get('code');
    const participantId = searchParams.get('participantId');

    if (!code?.trim()) {
      return NextResponse.json({ error: 'Ticket code is required' }, { status: 400 });
    }

    const ticket = await prisma.qrTicket.findUnique({
      where: { code: code.trim().toUpperCase() },
      include: {
        session: {
          select: { id: true, name: true, status: true, joinCode: true },
        },
      },
    });

    if (!ticket) {
      return NextResponse.json({ error: 'Invalid or unrecognized QR code.' }, { status: 404 });
    }

    if (ticket.session.status !== 'ACTIVE') {
      return NextResponse.json(
        {
          error:
            ticket.session.status === 'DRAFT'
              ? 'This game has not started yet. Please wait for the host to start!'
              : 'This hunt has concluded. All tickets are expired!',
          status: ticket.session.status,
        },
        { status: 400 }
      );
    }

    if (ticket.isExpired || (ticket.maxScans && ticket.scanCount >= ticket.maxScans)) {
      return NextResponse.json(
        { error: 'This ticket has already reached its maximum scan limit.', isExpired: true },
        { status: 410 }
      );
    }

    let alreadyClaimed = false;
    let existingScanInfo = null;

    if (participantId) {
      const existingScan = await prisma.qrScan.findUnique({
        where: {
          ticketId_participantId: {
            ticketId: ticket.id,
            participantId,
          },
        },
      });

      if (existingScan) {
        alreadyClaimed = true;
        existingScanInfo = {
          pointsEarned: existingScan.pointsEarned,
          isCorrect: existingScan.isCorrect,
          answer: existingScan.answer,
          scannedAt: existingScan.scannedAt,
        };
      }
    }

    // Return ticket details with trivia question & options, but NEVER expose correctAnswer
    return NextResponse.json({
      valid: true,
      ticketNumber: ticket.ticketNumber,
      sessionId: ticket.session.id,
      sessionName: ticket.session.name,
      isWinning: ticket.isWinning,
      potentialPoints: ticket.basePoints,
      hasQuestion: Boolean(ticket.question),
      question: ticket.question,
      options: ticket.options,
      timeLimit: ticket.timeLimit || 15,
      alreadyClaimed,
      existingScan: existingScanInfo,
      isExpired: ticket.isExpired,
    });
  } catch (error) {
    console.error('Ticket query error:', error);
    return NextResponse.json({ error: 'Failed to query ticket' }, { status: 500 });
  }
}

/**
 * POST /api/play/claim
 * Submit ticket claim and optional trivia response atomically with speed bonus & decay.
 */
export async function POST(req: Request) {
  try {
    const { code, participantId: rawParticipantId, name, answer, timeTaken } = await req.json();

    if (!code?.trim()) {
      return NextResponse.json({ error: 'Ticket code is required' }, { status: 400 });
    }

    const ticket = await prisma.qrTicket.findUnique({
      where: { code: code.trim().toUpperCase() },
      include: {
        session: {
          select: { id: true, name: true, status: true, joinCode: true },
        },
      },
    });

    if (!ticket) {
      return NextResponse.json({ error: 'Invalid or unrecognized QR code.' }, { status: 404 });
    }

    if (ticket.session.status !== 'ACTIVE') {
      return NextResponse.json(
        {
          error:
            ticket.session.status === 'DRAFT'
              ? 'This game has not started yet. Please wait for the host to start!'
              : 'This hunt has concluded. All tickets are expired!',
        },
        { status: 400 }
      );
    }

    if (ticket.isExpired || (ticket.maxScans && ticket.scanCount >= ticket.maxScans)) {
      return NextResponse.json({ error: 'This ticket has already reached its maximum scan limit.' }, { status: 410 });
    }

    let participantId = rawParticipantId;

    // If no participantId provided, register attendee using nickname
    if (!participantId) {
      if (!name?.trim()) {
        return NextResponse.json({
          needsRegistration: true,
          sessionId: ticket.session.id,
          sessionName: ticket.session.name,
          ticketNumber: ticket.ticketNumber,
        });
      }

      // Check if participant already exists with this name in this session
      let participant = await prisma.participant.findFirst({
        where: {
          sessionId: ticket.session.id,
          name: name.trim(),
        },
      });

      if (!participant) {
        participant = await prisma.participant.create({
          data: {
            sessionId: ticket.session.id,
            name: name.trim(),
            score: 0,
            streak: 0,
          },
        });
      }
      participantId = participant.id;
    }

    const participant = await prisma.participant.findUnique({
      where: { id: participantId },
    });

    if (!participant || participant.sessionId !== ticket.session.id) {
      return NextResponse.json({ error: 'Participant not found for this arena session.' }, { status: 404 });
    }

    // Check if user already claimed this specific ticket before transaction
    const existingScan = await prisma.qrScan.findUnique({
      where: {
        ticketId_participantId: {
          ticketId: ticket.id,
          participantId,
        },
      },
    });

    if (existingScan) {
      return NextResponse.json(
        {
          alreadyClaimed: true,
          error: `You already claimed Ticket #${ticket.ticketNumber}! Look for other QR codes around the venue.`,
          pointsEarned: existingScan.pointsEarned,
          isCorrect: existingScan.isCorrect,
          ticketNumber: ticket.ticketNumber,
        },
        { status: 409 }
      );
    }

    // Atomic transaction for claim, scan count increment, decay calculation, and score update
    // Resolves concurrency race conditions and guarantees unique claim constraint
    let claimResult;
    try {
      claimResult = await prisma.$transaction(async (tx) => {
        // Read fresh ticket inside transaction
        const liveTicket = await tx.qrTicket.findUnique({
          where: { id: ticket.id },
          select: {
            id: true,
            scanCount: true,
            maxScans: true,
            isExpired: true,
            isWinning: true,
            basePoints: true,
            question: true,
            correctAnswer: true,
            timeLimit: true,
            ticketNumber: true,
          },
        });

        if (!liveTicket) {
          throw new Error('Ticket not found');
        }

        if (liveTicket.isExpired || (liveTicket.maxScans && liveTicket.scanCount >= liveTicket.maxScans)) {
          return { errorType: 'EXPIRED' as const };
        }

        // Dynamic score decay based on atomic current scanCount
        const scanOrder = liveTicket.scanCount; // 0 for 1st scan, 1 for 2nd, etc.
        let baseDecayedPoints = liveTicket.basePoints || 100;
        if (liveTicket.isWinning) {
          if (scanOrder === 0) {
            baseDecayedPoints = liveTicket.basePoints; // 100%
          } else if (scanOrder === 1) {
            baseDecayedPoints = Math.round(liveTicket.basePoints * 0.8); // 80%
          } else if (scanOrder === 2) {
            baseDecayedPoints = Math.round(liveTicket.basePoints * 0.65); // 65%
          } else {
            baseDecayedPoints = Math.round(liveTicket.basePoints * 0.5); // 50% floor
          }
        }

        // Trivia validation & speed bonus calculation
        let isCorrect = true;
        let speedBonus = 0;
        let pointsEarned = baseDecayedPoints;

        if (liveTicket.question && liveTicket.correctAnswer) {
          const userAns = (answer || '').trim().toLowerCase();
          const correctAns = liveTicket.correctAnswer.trim().toLowerCase();
          isCorrect = userAns === correctAns;

          if (isCorrect) {
            // Speed bonus: up to +200 bonus points for fast response within timeLimit
            const limit = liveTicket.timeLimit || 15;
            const actualTime = typeof timeTaken === 'number' ? Math.max(0, timeTaken) : limit;
            const speedFraction = Math.max(0, 1 - actualTime / limit);
            speedBonus = Math.round(speedFraction * 200);
            pointsEarned = baseDecayedPoints + speedBonus;
          } else {
            // Consolation discovery points for finding the QR ticket despite incorrect answer
            pointsEarned = 50;
            speedBonus = 0;
          }
        }

        const nextScanCount = liveTicket.scanCount + 1;
        const shouldExpire = liveTicket.maxScans ? nextScanCount >= liveTicket.maxScans : false;

        await tx.qrTicket.update({
          where: { id: liveTicket.id },
          data: {
            scanCount: { increment: 1 },
            isExpired: shouldExpire,
          },
        });

        await tx.qrScan.create({
          data: {
            ticketId: liveTicket.id,
            participantId,
            sessionId: ticket.session.id,
            pointsEarned,
            answer: answer || null,
            isCorrect,
            timeTaken: typeof timeTaken === 'number' ? timeTaken : null,
          },
        });

        const updatedParticipant = await tx.participant.update({
          where: { id: participantId },
          data: {
            score: { increment: pointsEarned },
          },
        });

        return {
          errorType: null,
          pointsEarned,
          speedBonus,
          baseDecayedPoints,
          isCorrect,
          correctAnswer: liveTicket.correctAnswer,
          newScore: updatedParticipant.score,
        };
      });
    } catch (txErr: any) {
      // Catch Prisma duplicate unique constraint error (P2002) and return 409 Conflict
      if (txErr?.code === 'P2002') {
        return NextResponse.json(
          {
            alreadyClaimed: true,
            error: `You already claimed Ticket #${ticket.ticketNumber}! Look for other QR codes around the venue.`,
            ticketNumber: ticket.ticketNumber,
          },
          { status: 409 }
        );
      }
      throw txErr;
    }

    if (claimResult.errorType === 'EXPIRED') {
      return NextResponse.json({ error: 'This ticket has already reached its maximum scan limit.' }, { status: 410 });
    }

    // Broadcast Ably event for real-time host screen & leaderboard updates
    try {
      const ably = getAblyRest();
      if (ably) {
        const channel = ably.channels.get(`session:${ticket.session.id}`);
        channel.publish('ticket-scanned', {
          participantName: participant.name,
          ticketNumber: ticket.ticketNumber,
          isWinning: ticket.isWinning,
          isCorrect: claimResult.isCorrect,
          pointsEarned: claimResult.pointsEarned,
          speedBonus: claimResult.speedBonus,
          newScore: claimResult.newScore,
        });
        channel.publish('leaderboard-update', { timestamp: Date.now() });
      }
    } catch (ablyErr) {
      console.error('Ably publish error on ticket claim:', ablyErr);
    }

    return NextResponse.json({
      success: true,
      pointsEarned: claimResult.pointsEarned,
      speedBonus: claimResult.speedBonus,
      basePoints: claimResult.baseDecayedPoints,
      isCorrect: claimResult.isCorrect,
      correctAnswer: claimResult.correctAnswer,
      isWinning: ticket.isWinning,
      ticketNumber: ticket.ticketNumber,
      participantId,
      participantName: participant.name,
      newScore: claimResult.newScore,
    });
  } catch (error) {
    console.error('Ticket claim error:', error);
    return NextResponse.json({ error: 'Failed to process ticket claim' }, { status: 500 });
  }
}
