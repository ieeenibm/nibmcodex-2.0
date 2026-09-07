import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const sessionId = (await params).id;
    const { searchParams } = new URL(req.url);
    const participantId = searchParams.get('participantId');
    const questionId = searchParams.get('questionId');

    if (!participantId || !questionId) {
      return NextResponse.json({ error: 'Missing participantId or questionId' }, { status: 400 });
    }

    // First, fetch the participant to get their score for rank calculation
    const participant = await prisma.participant.findUnique({
      where: { id: participantId },
      select: { id: true, name: true, score: true, streak: true, sessionId: true },
    });

    if (!participant || participant.sessionId !== sessionId) {
      return NextResponse.json({ error: 'Participant not found' }, { status: 404 });
    }

    // Now run remaining queries in parallel (no inner await blocking)
    const [responses, higherScorersCount] = await Promise.all([
      prisma.response.findMany({
        where: {
          participantId,
          questionId,
        },
        select: {
          isCorrect: true,
          scoreEarned: true,
          answer: true,
        },
        orderBy: { answeredAt: 'desc' }
      }),
      prisma.participant.count({
        where: {
          sessionId,
          score: { gt: participant.score }
        }
      })
    ]);

    const response = responses[0];
    const scoreEarnedTotal = responses.reduce((acc, res) => acc + res.scoreEarned, 0);

    return NextResponse.json({
      hasSubmitted: responses.length > 0,
      submittedCount: responses.length,
      isCorrect: response?.isCorrect ?? false,
      scoreEarned: scoreEarnedTotal,
      currentScore: participant.score,
      currentStreak: participant.streak,
      rank: higherScorersCount + 1,
    });
  } catch (error) {
    console.error('Feedback fetch error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
