import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth';

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const authUser = await getAuthUser(req);
    if (!authUser) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id: userId, role } = authUser;
    const id = (await params).id;

    const question = await prisma.question.findUnique({
      where: { id },
      include: { session: true }
    });

    if (!question) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    if (role !== 'ADMIN' && question.session.hostId !== userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    if (question.session.activeQuestionId === id) {
      await prisma.session.update({
        where: { id: question.sessionId },
        data: { activeQuestionId: null, questionStartedAt: null },
      });
    }

    await prisma.response.deleteMany({ where: { questionId: id } });
    await prisma.question.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete question error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const authUser = await getAuthUser(req);
    if (!authUser) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id: userId, role } = authUser;
    const id = (await params).id;

    const question = await prisma.question.findUnique({
      where: { id },
      include: { session: true }
    });

    if (!question) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    if (role !== 'ADMIN' && question.session.hostId !== userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();
    const { text, type, options, images, correctAnswer, timeLimit, maxAnswers } = body;

    const updated = await prisma.question.update({
      where: { id },
      data: {
        ...(text !== undefined && { text }),
        ...(type !== undefined && { type }),
        ...(options !== undefined && { options }),
        ...(images !== undefined && { images }),
        ...(correctAnswer !== undefined && { correctAnswer }),
        ...(timeLimit !== undefined && { timeLimit }),
        ...(maxAnswers !== undefined && { maxAnswers }),
      }
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Update question error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

