import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import { publishSessionState } from '@/lib/ably';

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const userId = req.headers.get('x-user-id');
    const role = req.headers.get('x-user-role');
    const sessionId = (await params).id;

    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    // Verify session ownership
    const session = await prisma.session.findUnique({
      where: { id: sessionId },
      select: { hostId: true, status: true },
    });
    if (!session) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    if (role !== 'ADMIN' && session.hostId !== userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();
    const dataToUpdate: Prisma.SessionUpdateInput = {};

    // Validate status transitions using an explicit finite state machine
    if (body.status !== undefined) {
      if (body.status !== session.status) {
        const ALLOWED_TRANSITIONS: Record<string, string[]> = {
          DRAFT: ['ACTIVE'],
          ACTIVE: ['ENDED'],
          ENDED: ['DRAFT'],
        };
        const allowed = ALLOWED_TRANSITIONS[session.status] || [];
        if (!allowed.includes(body.status)) {
          return NextResponse.json(
            { error: `Invalid status transition from ${session.status} to ${body.status}` },
            { status: 400 }
          );
        }
        dataToUpdate.status = body.status;
      }
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

    // Broadcast real-time update to all connected attendees via Ably WebSockets
    const sessionDetails = await prisma.session.findUnique({
      where: { id: sessionId },
      select: { status: true, mode: true, activeQuestionId: true, questionStartedAt: true },
    });

    let activeQuestion = null;
    if (sessionDetails?.activeQuestionId) {
      activeQuestion = await prisma.question.findUnique({
        where: { id: sessionDetails.activeQuestionId },
        select: { id: true, type: true, text: true, options: true, timeLimit: true, maxAnswers: true },
      });
    }

    await publishSessionState(sessionId, {
      status: sessionDetails?.status || updatedSession.status,
      mode: sessionDetails?.mode || 'COMPETITIVE',
      activeQuestion,
      questionStartedAt: sessionDetails?.questionStartedAt?.toISOString() ?? null,
      serverTime: new Date().toISOString(),
    });

    return NextResponse.json(updatedSession);
  } catch (error) {
    console.error('Update session state error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
