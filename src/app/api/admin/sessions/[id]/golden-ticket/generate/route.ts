import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const userId = req.headers.get('x-user-id');
    const role = req.headers.get('x-user-role');
    const sessionId = (await params).id;

    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const session = await prisma.session.findUnique({
      where: { id: sessionId },
      select: { hostId: true },
    });

    if (!session) return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    if (role !== 'ADMIN' && session.hostId !== userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const {
      totalTickets = 15,
      winningCount = 3,
      basePointsWinning = 1000,
      basePointsRegular = 100,
      maxScans = null, // null for unlimited, or a number like 3
    } = await req.json();

    const count = Math.max(1, Math.min(100, parseInt(totalTickets, 10) || 15));
    const winCount = Math.max(0, Math.min(count, parseInt(winningCount, 10) || 3));

    // Determine randomly which tickets are the winning ones
    const ticketIndices = Array.from({ length: count }, (_, i) => i + 1);
    const shuffled = [...ticketIndices].sort(() => Math.random() - 0.5);
    const winningSet = new Set(shuffled.slice(0, winCount));

    // Find current max ticketNumber in this session
    const lastTicket = await prisma.qrTicket.findFirst({
      where: { sessionId },
      orderBy: { ticketNumber: 'desc' },
      select: { ticketNumber: true },
    });

    let startNum = (lastTicket?.ticketNumber ?? 0) + 1;
    const ticketsToCreate = [];

    for (let i = 0; i < count; i++) {
      const ticketNumber = startNum + i;
      const isWinning = winningSet.has(i + 1);
      // Generate a clean 10-char alphanumeric secure token
      const code = `TKT-${crypto.randomBytes(5).toString('hex').toUpperCase()}`;

      ticketsToCreate.push({
        sessionId,
        ticketNumber,
        code,
        isWinning,
        basePoints: isWinning ? basePointsWinning : basePointsRegular,
        maxScans: maxScans ? Math.max(1, parseInt(maxScans, 10)) : null,
        scanCount: 0,
        isExpired: false,
      });
    }

    await prisma.qrTicket.createMany({
      data: ticketsToCreate,
    });

    const tickets = await prisma.qrTicket.findMany({
      where: { sessionId },
      orderBy: { ticketNumber: 'asc' },
    });

    return NextResponse.json({
      success: true,
      createdCount: ticketsToCreate.length,
      totalTickets: tickets.length,
      tickets,
    });
  } catch (error) {
    console.error('Generate tickets error:', error);
    return NextResponse.json({ error: 'Failed to generate QR tickets' }, { status: 500 });
  }
}

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const sessionId = (await params).id;
    const tickets = await prisma.qrTicket.findMany({
      where: { sessionId },
      include: {
        _count: { select: { scans: true } },
      },
      orderBy: { ticketNumber: 'asc' },
    });

    return NextResponse.json(tickets);
  } catch (error) {
    console.error('Fetch tickets error:', error);
    return NextResponse.json({ error: 'Failed to fetch tickets' }, { status: 500 });
  }
}
