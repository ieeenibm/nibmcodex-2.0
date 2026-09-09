import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { publishAnswerSubmitted } from '@/lib/ably';

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const sessionId = (await params).id;
    const { participantId, questionId, answer } = await req.json();

    if (!participantId || !questionId || !answer?.trim()) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    // Fetch session, question, AND participant together to validate everything in one round-trip
    const [session, question, participant] = await Promise.all([
      prisma.session.findUnique({
        where: { id: sessionId },
        select: { status: true, activeQuestionId: true, questionStartedAt: true, mode: true }
      }),
      prisma.question.findUnique({
        where: { id: questionId },
        select: { sessionId: true, type: true, correctAnswer: true, timeLimit: true, maxAnswers: true, options: true }
      }),
      prisma.participant.findUnique({
        where: { id: participantId },
        select: { sessionId: true, streak: true }
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
    if (!participant || participant.sessionId !== sessionId) {
      return NextResponse.json({ error: 'Participant does not belong to this session' }, { status: 403 });
    }

    // Server-side time limit check (only if question has a time limit > 0)
    if (question.timeLimit > 0 && session.questionStartedAt) {
      const elapsed = (Date.now() - new Date(session.questionStartedAt).getTime()) / 1000;
      if (elapsed > question.timeLimit + 2) { // 2 second grace period for network latency
        return NextResponse.json({ error: 'Time is up!' }, { status: 400 });
      }
    }

    // Determine correctness
    const hasCorrectAnswer = !!question.correctAnswer && question.correctAnswer.trim() !== '' && question.correctAnswer !== 'null';
    const isCorrect = hasCorrectAnswer
      ? answer.trim().toLowerCase() === question.correctAnswer!.trim().toLowerCase()
      : false;

    // Time-based scoring: faster = more points (only for competitive sessions)
    let baseScore = 0;
    if (isCorrect && session.mode === 'COMPETITIVE') {
      if (question.timeLimit > 0 && session.questionStartedAt) {
        const timeTaken = Math.max(0, (Date.now() - new Date(session.questionStartedAt).getTime()) / 1000);
        const timeFraction = Math.max(0, 1 - timeTaken / question.timeLimit);
        // Base 500 + up to 500 time bonus = max 1000 pts
        baseScore = Math.round(500 + 500 * timeFraction);
      } else {
        // Untimed question awards standard 750 points
        baseScore = 750;
      }
    }

    // Execute atomic transaction for response creation and participant updates
    // maxAnswers check is INSIDE the transaction to prevent race conditions from spam-clicks
    let finalScore = baseScore;
    const result = await prisma.$transaction(async (tx) => {
      // Check maxAnswers inside transaction to prevent race condition
      const existingResponsesCount = await tx.response.count({
        where: { participantId, questionId }
      });

      if (existingResponsesCount >= (question.maxAnswers ?? 1)) {
        return { duplicate: true } as const;
      }

      if (isCorrect && session.mode === 'COMPETITIVE') {
        const currentStreak = participant.streak ?? 0;
        const newStreak = currentStreak + 1;

        // Additive streak bonus (replaces multiplicative 2.5x which caused runaway scores)
        // Streak 0: +0, Streak 1: +100, Streak 2: +200, ... Streak 5+: +500 (capped)
        const streakBonus = Math.min(500, currentStreak * 100);
        finalScore = baseScore + streakBonus;

        await tx.response.create({
          data: {
            questionId,
            participantId,
            answer,
            isCorrect,
            scoreEarned: finalScore,
          }
        });

        await tx.participant.update({
          where: { id: participantId },
          data: {
            score: { increment: finalScore },
            streak: newStreak,
          }
        });
      } else {
        // Incorrect or Non-Competitive mode
        await tx.response.create({
          data: {
            questionId,
            participantId,
            answer,
            isCorrect,
            scoreEarned: 0, // No points awarded
          }
        });

        if (session.mode === 'COMPETITIVE') {
          await tx.participant.update({
            where: { id: participantId },
            data: { streak: 0 }
          });
        }
      }

      return { duplicate: false } as const;
    }, { maxWait: 10000, timeout: 15000 });

    if (result.duplicate) {
      return NextResponse.json({ error: 'You have reached the maximum number of answers for this question' }, { status: 409 });
    }

    // After successful commit, publish real-time answer event to host via Ably
    // This is non-critical — fire-and-forget, host will still get data via SWR fallback
    try {
      const [responseCounts] = await prisma.$queryRaw<
        { total: number | bigint; correct: number | bigint }[]
      >`
        SELECT 
          COUNT(*)::int AS total,
          COUNT(*) FILTER (WHERE "isCorrect" = true)::int AS correct
        FROM "Response"
        WHERE "questionId" = ${questionId}
      `;

      const dist = await prisma.response.groupBy({
        by: ['answer'],
        where: { questionId },
        _count: { answer: true },
      });
      const mcqDistribution: Record<string, number> = {};
      for (const row of dist) {
        mcqDistribution[row.answer] = row._count.answer;
      }

      // Fire-and-forget — don't await
      publishAnswerSubmitted(sessionId, {
        questionId,
        totalResponses: Number(responseCounts?.total ?? 0),
        correctCount: Number(responseCounts?.correct ?? 0),
        mcqDistribution,
      });
    } catch {
      // Non-critical — swallow errors
    }

    return NextResponse.json({ success: true, isCorrect, scoreEarned: finalScore });
  } catch (error: any) {
    // Handle unique constraint violation from @@unique([participantId, questionId])
    if (error?.code === 'P2002') {
      return NextResponse.json({ error: 'You have already answered this question' }, { status: 409 });
    }
    console.error('Submit answer error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
