import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const sessionId = (await params).id;
    const body = await req.json();

    const dataToUpdate: any = {};
    if (body.status) dataToUpdate.status = body.status;

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
