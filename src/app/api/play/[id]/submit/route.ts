import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const sessionId = (await params).id;
    const { participantId, questionId, answer } = await req.json();

    if (!participantId || !questionId || !answer?.trim()) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    // Fetch session and question together to validate everything in one round-trip
    const [session, question] = await Promise.all([
      prisma.session.findUnique({
        where: { id: sessionId },
        select: { status: true, activeQuestionId: true, questionStartedAt: true, mode: true }
      }),
      prisma.question.findUnique({
        where: { id: questionId },
        select: { sessionId: true, type: true, correctAnswer: true, timeLimit: true, options: true }
      }),
    ]);

    // Validate session is active and this is the current question
    if (!session || session.status !== 'ACTIVE') {
      return NextResponse.json({ error: 'Session is not active' }, { status: 400 });
    }
    if (session.activeQuestionId !== questionId) {
      return NextResponse.json({ error: 'This question is no longer active' }, { status: 400 });
    }
    if (!question || question.sessionId !== sessionId) {
      return NextResponse.json({ error: 'Invalid question' }, { status: 400 });
    }

    // Server-side time limit check (only if question has a time limit > 0)
    if (question.timeLimit > 0 && session.questionStartedAt) {
      const elapsed = (Date.now() - new Date(session.questionStartedAt).getTime()) / 1000;
      if (elapsed > question.timeLimit + 2) { // 2 second grace period for network latency
        return NextResponse.json({ error: 'Time is up!' }, { status: 400 });
      }
    }

    // Determine correctness
    let isCorrect = false;
    if (question.type === 'MCQ') {
      isCorrect = answer === question.correctAnswer;
    } else if (question.type === 'TEXT') {
      isCorrect = !!question.correctAnswer &&
        answer.trim().toLowerCase() === question.correctAnswer.trim().toLowerCase();
    }
    // POLL type: isCorrect stays false, no points

    // Time-based scoring: faster = more points (only for competitive sessions)
    let scoreEarned = 0;
    if (isCorrect && session.mode === 'COMPETITIVE') {
      if (question.timeLimit > 0 && session.questionStartedAt) {
        const timeTaken = (Date.now() - new Date(session.questionStartedAt).getTime()) / 1000;
        const timeFraction = Math.max(0, 1 - timeTaken / question.timeLimit);
        // Base 500 + up to 500 time bonus = max 1000 pts
        scoreEarned = Math.round(500 + 500 * timeFraction);
      } else {
        // Untimed question awards standard 750 points
        scoreEarned = 750;
      }
    }

    // Create response — the DB unique constraint will reject duplicates
    let response;
    try {
      response = await prisma.response.create({
        data: {
          questionId,
          participantId,
          answer,
          isCorrect,
          scoreEarned,
        }
      });
    } catch (err: any) {
      // Prisma unique constraint violation (P2002)
      if (err?.code === 'P2002') {
        return NextResponse.json({ error: 'You have already answered this question' }, { status: 409 });
      }
      throw err;
    }

    // Update participant score and streak atomically
    if (isCorrect && session.mode === 'COMPETITIVE') {
      // Fetch current streak to calculate multiplier
      const participant = await prisma.participant.findUnique({
        where: { id: participantId },
        select: { streak: true }
      });
      const currentStreak = participant?.streak ?? 0;
      const newStreak = currentStreak + 1;
      // Multiplier: 1x base, +0.1x per streak, capped at 2.5x (15 consecutive)
      const multiplier = Math.min(2.5, 1 + currentStreak * 0.1);
      const finalScore = Math.round(scoreEarned * multiplier);

      await prisma.participant.update({
        where: { id: participantId },
        data: {
          score: { increment: finalScore },
          streak: newStreak,
        }
      });

      // Update stored scoreEarned with the multiplied value
      await prisma.response.update({
        where: { id: response.id },
        data: { scoreEarned: finalScore }
      });

    } else if (!isCorrect && session.mode === 'COMPETITIVE') {
      // Reset streak on wrong answer
      await prisma.participant.update({
        where: { id: participantId },
        data: { streak: 0 }
      });
    }

    return NextResponse.json({ success: true, isCorrect, scoreEarned });
  } catch (error) {
    console.error('Submit answer error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
