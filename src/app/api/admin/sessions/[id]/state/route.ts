import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const userId = req.headers.get('x-user-id');
    const role = req.headers.get('x-user-role');
    const sessionId = (await params).id;

    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    // Verify session ownership
    const session = await prisma.session.findUnique({ where: { id: sessionId }, select: { hostId: true } });
    if (!session) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    if (role !== 'ADMIN' && session.hostId !== userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();
    const dataToUpdate: Record<string, unknown> = {};

    // Validate status transitions
    const validStatuses = ['DRAFT', 'ACTIVE', 'ENDED'];
    if (body.status && validStatuses.includes(body.status)) {
      dataToUpdate.status = body.status;
    }

    if (body.activeQuestionId !== undefined) {
      dataToUpdate.activeQuestionId = body.activeQuestionId;
      // Record when this question became active — used for time-based scoring
      dataToUpdate.questionStartedAt = body.activeQuestionId ? new Date() : null;
    }

    // When ending the session, clear the active question
    if (body.status === 'ENDED') {
      dataToUpdate.activeQuestionId = null;
      dataToUpdate.questionStartedAt = null;
    }

    const updatedSession = await prisma.session.update({
      where: { id: sessionId },
      data: dataToUpdate,
    });

    return NextResponse.json(updatedSession);
  } catch (error) {
    console.error('Update session state error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
