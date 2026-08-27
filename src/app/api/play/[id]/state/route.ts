import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const sessionId = (await params).id;
    
    const session = await prisma.session.findUnique({
      where: { id: sessionId },
      select: {
        status: true,
        activeQuestionId: true,
        questionStartedAt: true,
      }
    });

    if (!session) return NextResponse.json({ error: 'Session not found' }, { status: 404 });

    const url = new URL(req.url);
    const clientQuestionId = url.searchParams.get('qId');

    let activeQuestion = null;
    if (session.activeQuestionId && session.activeQuestionId !== clientQuestionId) {
      // Do NOT select correctAnswer here so users can't inspect element to cheat!
      activeQuestion = await prisma.question.findUnique({
        where: { id: session.activeQuestionId },
        select: {
          id: true,
          type: true,
          text: true,
          options: true,
          timeLimit: true,
          maxAnswers: true,
        }
      });
    } else if (session.activeQuestionId === clientQuestionId) {
      // Client already has the active question, just tell them to keep using it
      activeQuestion = { id: session.activeQuestionId, unchanged: true };
    }

    return NextResponse.json({
      status: session.status,
      activeQuestion,
      questionStartedAt: session.questionStartedAt,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
