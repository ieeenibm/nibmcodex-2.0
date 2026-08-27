import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { name, joinCode } = await req.json();

    if (!name || !joinCode) {
      return NextResponse.json({ error: 'Name and game code are required' }, { status: 400 });
    }

    const session = await prisma.session.findUnique({
      where: { joinCode },
    });

    if (!session) {
      return NextResponse.json({ error: 'Invalid game code' }, { status: 404 });
    }

    if (session.status === 'ENDED') {
      return NextResponse.json({ error: 'This session has already ended' }, { status: 400 });
    }

    // Create participant
    const participant = await prisma.participant.create({
      data: {
        name,
        sessionId: session.id,
      }
    });

    return NextResponse.json({ 
      participantId: participant.id, 
      sessionId: session.id 
    });
  } catch (error) {
    console.error('Join error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
