import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const userId = req.headers.get('x-user-id');
    const role = req.headers.get('x-user-role');
    const id = (await params).id;

    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

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
