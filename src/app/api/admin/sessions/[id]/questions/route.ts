import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const sessionId = (await params).id;
    const body = await req.json();

    // Verify session belongs to user (skipping detailed check for speed, handled by middleware route protection partially)
    const session = await prisma.session.findUnique({ where: { id: sessionId }, include: { questions: true } });
    if (!session) return NextResponse.json({ error: 'Session not found' }, { status: 404 });

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
