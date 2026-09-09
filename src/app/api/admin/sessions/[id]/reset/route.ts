import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth';
import { publishSessionState } from '@/lib/ably';

export const dynamic = 'force-dynamic';

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const authUser = await getAuthUser(req);
    if (!authUser) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id: userId, role } = authUser;
    const id = (await params).id;

    const session = await prisma.session.findUnique({ where: { id } });
    if (!session) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    if (role !== 'ADMIN' && session.hostId !== userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // 1. Delete attendee responses, scans, and participant records
    await prisma.response.deleteMany({ where: { question: { sessionId: id } } });
    await prisma.qrScan.deleteMany({ where: { sessionId: id } });
    await prisma.participant.deleteMany({ where: { sessionId: id } });
    
    // 2. Reset QR ticket usage counters so physical printed QR codes remain reusable
    await prisma.qrTicket.updateMany({
      where: { sessionId: id },
      data: {
        scanCount: 0,
        isExpired: false,
      }
    });

    // 3. Reset session state to DRAFT
    const updated = await prisma.session.update({
      where: { id },
      data: {
        status: 'DRAFT',
        activeQuestionId: null,
        questionStartedAt: null,
      }
    });

    // 4. Broadcast reset state to connected screens and participants
    try {
      await publishSessionState(id, {
        status: 'DRAFT',
        mode: session.mode,
        gameType: session.gameType,
        activeQuestion: null,
        questionStartedAt: null,
        serverTime: new Date().toISOString(),
        phase: null,
      });
    } catch (ablyErr) {
      console.warn('[Reset] Failed to publish Ably reset state:', ablyErr);
    }

    return NextResponse.json({ success: true, session: updated });
  } catch (error) {
    console.error('Reset session error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
