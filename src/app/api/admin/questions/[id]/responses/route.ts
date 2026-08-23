import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const questionId = (await params).id;
    const responses = await prisma.response.findMany({
      where: { questionId },
      include: { participant: true },
    });
    return NextResponse.json(responses);
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
