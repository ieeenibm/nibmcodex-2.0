import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const id = (await params).id;

    // Single query: fetch session + participants in one round-trip
    const session = await prisma.session.findUnique({
      where: { id },
      select: {
        status: true,
        mode: true,
        activeQuestionId: true,
        participants: {
          select: { id: true, name: true, score: true, streak: true },
        },
      },
    });

    if (!session) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const totalParticipants = session.participants.length;
    let activeQuestionResponsesCount = 0;
    let correctCount = 0;
    let mcqDistribution: Record<string, number> = {};

    if (session.activeQuestionId) {
      // Aggregate counts in a single DB query — no fetching of full objects
      const [responseCounts] = await prisma.$queryRaw<
        { total: bigint; correct: bigint }[]
      >`
        SELECT 
          COUNT(*)::int AS total,
          COUNT(*) FILTER (WHERE "isCorrect" = true)::int AS correct
        FROM "Response"
        WHERE "questionId" = ${session.activeQuestionId}
      `;

      activeQuestionResponsesCount = Number(responseCounts.total);
      correctCount = Number(responseCounts.correct);

      // Distribution for Non-Competitive bar charts
      if (session.mode === 'NON_COMPETITIVE') {
        const dist = await prisma.response.groupBy({
          by: ['answer'],
          where: { questionId: session.activeQuestionId },
          _count: { answer: true },
        });
        for (const row of dist) {
          mcqDistribution[row.answer] = row._count.answer;
        }
      }
    }

    // Sorted leaderboard — only compute when session is ENDED or for display
    const leaderboard = [...session.participants]
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);

    return NextResponse.json({
      totalParticipants,
      activeQuestionResponsesCount,
      correctCount,
      mcqDistribution,
      leaderboard,
    });
  } catch (error) {
    console.error('Fetch live stats error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
