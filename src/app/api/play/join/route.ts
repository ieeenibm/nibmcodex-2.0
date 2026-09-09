import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { publishParticipantJoined } from '@/lib/ably';

export async function POST(req: Request) {
  try {
    const { name, joinCode } = await req.json();

    const trimmedName = typeof name === 'string' ? name.trim() : '';
    const trimmedCode = typeof joinCode === 'string' ? joinCode.trim().toUpperCase() : '';

    if (!trimmedName || !trimmedCode) {
      return NextResponse.json({ error: 'Valid nickname and game code are required' }, { status: 400 });
    }

    if (trimmedName.length > 25) {
      return NextResponse.json({ error: 'Nickname cannot exceed 25 characters' }, { status: 400 });
    }

    const session = await prisma.session.findUnique({
      where: { joinCode: trimmedCode },
    });

    if (!session) {
      return NextResponse.json({ error: 'Invalid game code' }, { status: 404 });
    }

    if (session.status === 'ENDED') {
      return NextResponse.json({ error: 'This session has already ended' }, { status: 400 });
    }

    // Check if participant already exists in this session (case-insensitive)
    let participant = await prisma.participant.findFirst({
      where: {
        sessionId: session.id,
        name: {
          equals: trimmedName,
          mode: 'insensitive',
        },
      },
    });

    if (!participant) {
      // Create new participant
      participant = await prisma.participant.create({
        data: {
          name: trimmedName,
          sessionId: session.id,
        },
      });
    }

    // Broadcast participant count update to host screen
    try {
      const totalParticipants = await prisma.participant.count({
        where: { sessionId: session.id },
      });
      await publishParticipantJoined(session.id, {
        participantId: participant.id,
        name: participant.name,
        totalParticipants,
      });
    } catch (publishErr) {
      console.warn('[Join] Failed to broadcast participant joined (non-critical):', publishErr);
    }

    return NextResponse.json({ 
      participantId: participant.id, 
      sessionId: session.id 
    });
  } catch (error) {
    console.error('Join error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
