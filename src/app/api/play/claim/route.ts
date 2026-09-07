import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAblyRest } from '@/lib/ably';

export async function POST(req: Request) {
  try {
    const { code, participantId: rawParticipantId, name } = await req.json();

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

    if (ticket.isExpired) {
      return NextResponse.json({ error: 'This ticket has already reached its maximum scan limit.' }, { status: 410 });
    }

    if (ticket.maxScans && ticket.scanCount >= ticket.maxScans) {
      return NextResponse.json({ error: 'This ticket has expired.' }, { status: 410 });
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

    // Check if user already claimed this specific ticket
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
          ticketNumber: ticket.ticketNumber,
        },
        { status: 409 }
      );
    }

    // Points calculation with dynamic score decay on repeat scans
    let pointsEarned = 100;
    if (ticket.isWinning) {
      const scanOrder = ticket.scanCount; // 0 for 1st scan, 1 for 2nd, etc.
      if (scanOrder === 0) {
        pointsEarned = ticket.basePoints; // 100% (e.g. 1000)
      } else if (scanOrder === 1) {
        pointsEarned = Math.round(ticket.basePoints * 0.8); // 80% (e.g. 800)
      } else if (scanOrder === 2) {
        pointsEarned = Math.round(ticket.basePoints * 0.65); // 65% (e.g. 650)
      } else {
        pointsEarned = Math.round(ticket.basePoints * 0.5); // 50% floor (e.g. 500)
      }
    } else {
      pointsEarned = ticket.basePoints || 100;
    }

    // Execute atomic claim transaction
    const newScanCount = ticket.scanCount + 1;
    const shouldExpire = ticket.maxScans ? newScanCount >= ticket.maxScans : false;

    const [scan, updatedParticipant] = await prisma.$transaction([
      prisma.qrScan.create({
        data: {
          ticketId: ticket.id,
          participantId,
          sessionId: ticket.session.id,
          pointsEarned,
        },
      }),
      prisma.participant.update({
        where: { id: participantId },
        data: {
          score: { increment: pointsEarned },
        },
      }),
      prisma.qrTicket.update({
        where: { id: ticket.id },
        data: {
          scanCount: { increment: 1 },
          isExpired: shouldExpire,
        },
      }),
    ]);

    // Broadcast Ably event for real-time leaderboard update
    try {
      const ably = getAblyRest();
      if (ably) {
        const channel = ably.channels.get(`session:${ticket.session.id}`);
        channel.publish('ticket-scanned', {
          participantName: participant.name,
          ticketNumber: ticket.ticketNumber,
          isWinning: ticket.isWinning,
          pointsEarned,
          newScore: updatedParticipant.score,
        });
        channel.publish('leaderboard-update', { timestamp: Date.now() });
      }
    } catch (ablyErr) {
      console.error('Ably publish error on ticket claim:', ablyErr);
    }

    return NextResponse.json({
      success: true,
      pointsEarned,
      isWinning: ticket.isWinning,
      ticketNumber: ticket.ticketNumber,
      participantId,
      participantName: participant.name,
      newScore: updatedParticipant.score,
    });
  } catch (error) {
    console.error('Ticket claim error:', error);
    return NextResponse.json({ error: 'Failed to process ticket claim' }, { status: 500 });
  }
}
