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

    const [participant, responses, higherScorersCount] = await Promise.all([
      prisma.participant.findUnique({
        where: { id: participantId },
        select: { id: true, name: true, score: true, streak: true, sessionId: true },
      }),
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
      // We will compute rank once we verify participant
      prisma.participant.count({
        where: {
          sessionId,
          score: {
            gt: (await prisma.participant.findUnique({ where: { id: participantId }, select: { score: true } }))?.score ?? 0
          }
        }
      })
    ]);

    if (!participant || participant.sessionId !== sessionId) {
      return NextResponse.json({ error: 'Participant not found' }, { status: 404 });
    }

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
