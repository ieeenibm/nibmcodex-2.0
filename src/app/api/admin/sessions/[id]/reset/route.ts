import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { publishSessionState } from '@/lib/ably';

export const dynamic = 'force-dynamic';

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const userId = req.headers.get('x-user-id');
    const role = req.headers.get('x-user-role');
    const id = (await params).id;

    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const session = await prisma.session.findUnique({ where: { id } });
    if (!session) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    if (role !== 'ADMIN' && session.hostId !== userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Delete responses and participants to restart session completely
    await prisma.response.deleteMany({ where: { question: { sessionId: id } } });
    await prisma.participant.deleteMany({ where: { sessionId: id } });
    
    // Reset session state
    await prisma.session.update({
      where: { id },
      data: {
        status: 'DRAFT',
        activeQuestionId: null,
        questionStartedAt: null,
      }
    });

    await publishSessionState(id, {
      status: 'DRAFT',
      mode: session.mode,
      activeQuestion: null,
      questionStartedAt: null,
      serverTime: new Date().toISOString(),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Reset session error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
