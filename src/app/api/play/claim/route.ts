import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAblyRest } from '@/lib/ably';

/**
 * GET /api/play/claim?code=...&participantId=...
 * Query ticket status. Distinguishes between Decoy QR and Single Winning QR.
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

    // Decoy QR ticket — immediate guidance, no questions
    if (!ticket.isWinning) {
      return NextResponse.json({
        valid: true,
        isWinning: false,
        ticketNumber: ticket.ticketNumber,
        sessionId: ticket.session.id,
        sessionName: ticket.session.name,
        message: 'This is not the Golden Ticket! Keep searching the venue to find the right QR code.',
      });
    }

    // Single Winning Golden Ticket QR
    if (ticket.isExpired || (ticket.maxScans && ticket.scanCount >= ticket.maxScans)) {
      return NextResponse.json(
        { error: 'The Golden Ticket has already been cracked and claimed!', isExpired: true },
        { status: 410 }
      );
    }

    let alreadyClaimed = false;
    let attemptsUsed = 0;
    const maxAttempts = ticket.maxAttempts || 1;

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
        attemptsUsed = existingScan.attemptsUsed;
        if (existingScan.isCorrect) {
          alreadyClaimed = true;
        }
      }
    }

    const attemptsRemaining = Math.max(0, maxAttempts - attemptsUsed);

    return NextResponse.json({
      valid: true,
      isWinning: true,
      ticketNumber: ticket.ticketNumber,
      sessionId: ticket.session.id,
      sessionName: ticket.session.name,
      potentialPoints: ticket.basePoints,
      hasQuestion: Boolean(ticket.question),
      question: ticket.question,
      options: ticket.options,
      timeLimit: ticket.timeLimit || 30,
      maxAttempts,
      attemptsUsed,
      attemptsRemaining,
      alreadyClaimed,
      isExpired: ticket.isExpired,
    });
  } catch (error) {
    console.error('Ticket query error:', error);
    return NextResponse.json({ error: 'Failed to query ticket' }, { status: 500 });
  }
}

/**
 * POST /api/play/claim
 * Process ticket scan or winning trivia answer submission.
 * Strictly guarantees points are awarded ONLY on correct answers.
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

    let participantId = rawParticipantId;

    // Resolve or register attendee using case-insensitive lookup
    if (!participantId) {
      const trimmedName = name?.trim();
      if (!trimmedName) {
        return NextResponse.json({
          needsRegistration: true,
          sessionId: ticket.session.id,
          sessionName: ticket.session.name,
          ticketNumber: ticket.ticketNumber,
        });
      }

      let participant = await prisma.participant.findFirst({
        where: {
          sessionId: ticket.session.id,
          name: {
            equals: trimmedName,
            mode: 'insensitive',
          },
        },
      });

      if (!participant) {
        participant = await prisma.participant.create({
          data: {
            sessionId: ticket.session.id,
            name: trimmedName,
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

    // === CASE 1: DECOY QR TICKET ===
    // Scanning a decoy ticket awards ZERO points and notifies the attendee to keep looking
    if (!ticket.isWinning) {
      // Upsert scan history with 0 points so attendee sees they checked this code
      await prisma.qrScan.upsert({
        where: {
          ticketId_participantId: {
            ticketId: ticket.id,
            participantId,
          },
        },
        create: {
          ticketId: ticket.id,
          participantId,
          sessionId: ticket.session.id,
          pointsEarned: 0,
          isCorrect: false,
          answer: 'DECOY',
          attemptsUsed: 1,
        },
        update: {},
      });

      return NextResponse.json({
        success: false,
        isWinning: false,
        pointsEarned: 0,
        ticketNumber: ticket.ticketNumber,
        message: 'This is not the Golden Ticket! Keep searching the venue to find the right QR code.',
      });
    }

    // === CASE 2: SINGLE WINNING GOLDEN TICKET QR ===
    if (ticket.isExpired || (ticket.maxScans && ticket.scanCount >= ticket.maxScans)) {
      return NextResponse.json({ error: 'The Golden Ticket has already been cracked and claimed!' }, { status: 410 });
    }

    const existingScan = await prisma.qrScan.findUnique({
      where: {
        ticketId_participantId: {
          ticketId: ticket.id,
          participantId,
        },
      },
    });

    const maxAttempts = ticket.maxAttempts || 1;
    const currentAttemptsUsed = existingScan?.attemptsUsed ?? 0;

    if (existingScan?.isCorrect) {
      return NextResponse.json(
        {
          alreadyClaimed: true,
          error: 'You have already cracked and claimed this Golden Ticket!',
          ticketNumber: ticket.ticketNumber,
          pointsEarned: existingScan.pointsEarned,
        },
        { status: 409 }
      );
    }

    if (currentAttemptsUsed >= maxAttempts) {
      return NextResponse.json(
        {
          error: `You have exhausted all ${maxAttempts} attempt(s) for this Golden Ticket!`,
          attemptsRemaining: 0,
        },
        { status: 400 }
      );
    }

    // Evaluate trivia answer
    const userAns = (answer || '').trim().toLowerCase();
    const correctAns = (ticket.correctAnswer || '').trim().toLowerCase();
    const isCorrect = Boolean(correctAns && userAns === correctAns);

    const newAttemptsUsed = currentAttemptsUsed + 1;
    const attemptsRemaining = Math.max(0, maxAttempts - newAttemptsUsed);

    // SUB-CASE 2A: INCORRECT ANSWER -> STRICTLY 0 POINTS
    if (!isCorrect) {
      await prisma.qrScan.upsert({
        where: {
          ticketId_participantId: {
            ticketId: ticket.id,
            participantId,
          },
        },
        create: {
          ticketId: ticket.id,
          participantId,
          sessionId: ticket.session.id,
          pointsEarned: 0, // STRICTLY ZERO POINTS
          isCorrect: false,
          answer: answer || '',
          timeTaken: typeof timeTaken === 'number' ? timeTaken : null,
          attemptsUsed: newAttemptsUsed,
        },
        update: {
          attemptsUsed: newAttemptsUsed,
          answer: answer || '',
          timeTaken: typeof timeTaken === 'number' ? timeTaken : null,
          isCorrect: false,
          pointsEarned: 0, // NEVER AWARD POINTS ON WRONG ANSWER
        },
      });

      return NextResponse.json({
        success: false,
        isCorrect: false,
        isWinning: true,
        pointsEarned: 0,
        attemptsUsed: newAttemptsUsed,
        attemptsRemaining,
        message: attemptsRemaining > 0
          ? `Incorrect answer! You have ${attemptsRemaining} attempt(s) remaining.`
          : `Incorrect answer! All ${maxAttempts} attempt(s) for this Golden Ticket have been used.`,
      });
    }

    // SUB-CASE 2B: CORRECT ANSWER -> CALCULATE TIME-DECAY POINTS
    const basePoints = ticket.basePoints || 1000;
    const timeLimit = ticket.timeLimit || 30;
    const actualTime = typeof timeTaken === 'number' ? Math.max(0, Math.min(timeLimit, timeTaken)) : 0;
    
    // Points degrade over time: 100% on instant answer down to 40% floor at timer limit
    const speedFraction = Math.max(0, 1 - actualTime / timeLimit);
    const pointsEarned = Math.max(100, Math.round(basePoints * (0.4 + 0.6 * speedFraction)));

    // Atomic transaction for claim, scan count, and participant score increment
    const transactionResult = await prisma.$transaction(async (tx) => {
      // Atomically increment ticket's scanCount
      const updatedTicket = await tx.qrTicket.update({
        where: { id: ticket.id },
        data: {
          scanCount: { increment: 1 },
          isExpired: ticket.maxScans ? { set: (ticket.scanCount + 1) >= ticket.maxScans } : false,
        },
      });

      // Upsert winning scan record
      await tx.qrScan.upsert({
        where: {
          ticketId_participantId: {
            ticketId: ticket.id,
            participantId,
          },
        },
        create: {
          ticketId: ticket.id,
          participantId,
          sessionId: ticket.session.id,
          pointsEarned,
          isCorrect: true,
          answer: answer || '',
          timeTaken: actualTime,
          attemptsUsed: newAttemptsUsed,
        },
        update: {
          pointsEarned,
          isCorrect: true,
          answer: answer || '',
          timeTaken: actualTime,
          attemptsUsed: newAttemptsUsed,
        },
      });

      // Increment participant score ONLY on correct answer
      const updatedParticipant = await tx.participant.update({
        where: { id: participantId },
        data: {
          score: { increment: pointsEarned },
        },
      });

      return {
        pointsEarned,
        newScore: updatedParticipant.score,
        ticketNumber: updatedTicket.ticketNumber,
      };
    }, { maxWait: 10000, timeout: 15000 });

    // Broadcast real-time claim event to host console via Ably
    try {
      const ably = getAblyRest();
      if (ably) {
        const channel = ably.channels.get(`session:${ticket.session.id}`);
        channel.publish('ticket-scanned', {
          participantName: participant.name,
          ticketNumber: ticket.ticketNumber,
          isWinning: true,
          isCorrect: true,
          pointsEarned: transactionResult.pointsEarned,
          newScore: transactionResult.newScore,
        });
        channel.publish('leaderboard-update', { timestamp: Date.now() });
      }
    } catch (ablyErr) {
      console.error('Ably publish error on ticket claim:', ablyErr);
    }

    return NextResponse.json({
      success: true,
      isCorrect: true,
      isWinning: true,
      pointsEarned: transactionResult.pointsEarned,
      newScore: transactionResult.newScore,
      ticketNumber: ticket.ticketNumber,
      participantId,
      participantName: participant.name,
      message: 'Congratulations! You cracked the Golden Ticket challenge!',
    });
  } catch (error) {
    console.error('Ticket claim error:', error);
    return NextResponse.json({ error: 'Failed to process ticket claim' }, { status: 500 });
  }
}

