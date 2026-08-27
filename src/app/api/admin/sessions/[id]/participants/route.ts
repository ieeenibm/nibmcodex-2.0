import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const sessionId = (await params).id;
    const participants = await prisma.participant.findMany({
      where: { sessionId },
    });
    return NextResponse.json(participants);
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
