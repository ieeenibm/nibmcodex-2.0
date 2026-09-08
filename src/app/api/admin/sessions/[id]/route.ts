import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const authUser = await getAuthUser(req);
    if (!authUser) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id: userId, role } = authUser;
    const id = (await params).id;

    const session = await prisma.session.findUnique({
      where: { id },
      include: {
        questions: { orderBy: { order: 'asc' } }
      }
    });

    if (!session) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    if (role !== 'ADMIN' && session.hostId !== userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    return NextResponse.json({ ...session, serverTime: new Date().toISOString() });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const authUser = await getAuthUser(req);
    if (!authUser) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id: userId, role } = authUser;
    const id = (await params).id;

    const session = await prisma.session.findUnique({ where: { id } });
    if (!session) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    // Only allow admin or the host who created it
    if (role !== 'ADMIN' && session.hostId !== userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Must delete related records first to maintain relational integrity
    await prisma.response.deleteMany({ where: { question: { sessionId: id } } });
    await prisma.qrScan.deleteMany({ where: { sessionId: id } });
    await prisma.qrTicket.deleteMany({ where: { sessionId: id } });
    await prisma.question.deleteMany({ where: { sessionId: id } });
    await prisma.participant.deleteMany({ where: { sessionId: id } });
    
    await prisma.session.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete session error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
