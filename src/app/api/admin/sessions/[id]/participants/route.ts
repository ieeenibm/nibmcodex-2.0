import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const userId = req.headers.get('x-user-id');
    const role = req.headers.get('x-user-role');
    const sessionId = (await params).id;

    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const session = await prisma.session.findUnique({ where: { id: sessionId }, select: { hostId: true } });
    if (!session) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    if (role !== 'ADMIN' && session.hostId !== userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const participants = await prisma.participant.findMany({
      where: { sessionId },
      orderBy: { score: 'desc' },
    });
    return NextResponse.json(participants);
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
