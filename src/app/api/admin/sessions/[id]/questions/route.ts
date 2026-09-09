import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth';

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const authUser = await getAuthUser(req);
    if (!authUser) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id: userId, role } = authUser;
    const sessionId = (await params).id;

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
        images: body.images || null,
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
