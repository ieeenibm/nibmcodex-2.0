import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const userId = req.headers.get('x-user-id');
    const role = req.headers.get('x-user-role');
    const sessionId = (await params).id;

    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    // Verify session ownership
    const session = await prisma.session.findUnique({
      where: { id: sessionId },
      select: { hostId: true, questions: { select: { id: true } } },
    });
    if (!session) return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    if (role !== 'ADMIN' && session.hostId !== userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();

    const nextOrder = session.questions.length + 1;

    const question = await prisma.question.create({
      data: {
        sessionId,
        type: body.type,
        text: body.text,
        options: body.options || null,
        correctAnswer: body.correctAnswer || null,
        timeLimit: body.timeLimit !== undefined ? Number(body.timeLimit) : 30,
        maxAnswers: body.maxAnswers !== undefined ? Number(body.maxAnswers) : 1,
        order: nextOrder,
      }
    });

    return NextResponse.json(question);
  } catch (error) {
    console.error('Create question error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
