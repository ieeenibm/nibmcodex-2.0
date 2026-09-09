import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const authUser = await getAuthUser(req);
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (authUser.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Forbidden. Only administrators can perform a full database reset.' },
        { status: 403 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const { confirmText, wipeHosts } = body;

    if (confirmText !== 'RESET') {
      return NextResponse.json(
        { error: 'Safety verification failed. You must provide confirmText: "RESET".' },
        { status: 400 }
      );
    }

    // Execute transactional wipe in foreign-key safe order
    const result = await prisma.$transaction(async (tx) => {
      const responsesDeleted = await tx.response.deleteMany();
      const qrScansDeleted = await tx.qrScan.deleteMany();
      const qrTicketsDeleted = await tx.qrTicket.deleteMany();
      const questionsDeleted = await tx.question.deleteMany();
      const participantsDeleted = await tx.participant.deleteMany();
      const sessionsDeleted = await tx.session.deleteMany();

      let hostsDeleted = { count: 0 };
      if (wipeHosts === true) {
        // Delete all non-admin host users while strictly preserving ADMIN accounts
        hostsDeleted = await tx.user.deleteMany({
          where: { role: { not: 'ADMIN' } },
        });
      }

      return {
        responses: responsesDeleted.count,
        qrScans: qrScansDeleted.count,
        qrTickets: qrTicketsDeleted.count,
        questions: questionsDeleted.count,
        participants: participantsDeleted.count,
        sessions: sessionsDeleted.count,
        hosts: hostsDeleted.count,
      };
    });

    console.log('[Database Reset] Full database reset performed by admin:', authUser.username, result);

    return NextResponse.json({
      success: true,
      message: 'Full database reset completed successfully.',
      wipedCounts: result,
    });
  } catch (error) {
    console.error('Reset database error:', error);
    return NextResponse.json({ error: 'Internal Server Error during database reset' }, { status: 500 });
  }
}
