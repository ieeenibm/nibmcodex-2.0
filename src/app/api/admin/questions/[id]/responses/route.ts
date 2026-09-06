import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const userId = req.headers.get('x-user-id');
    const role = req.headers.get('x-user-role');
    const questionId = (await params).id;

    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    // Verify ownership via question -> session -> host chain
    const question = await prisma.question.findUnique({
      where: { id: questionId },
      select: { session: { select: { hostId: true } } },
    });
    if (!question) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    if (role !== 'ADMIN' && question.session.hostId !== userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    const responses = await prisma.response.findMany({
      where: { questionId },
      include: { participant: true },
    });
    return NextResponse.json(responses);
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
