import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import crypto from 'crypto';
import { getAuthUser } from '@/lib/auth';

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const authUser = await getAuthUser(req);
    if (!authUser) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const sessionId = (await params).id;

    const session = await prisma.session.findUnique({
      where: { id: sessionId },
      select: { hostId: true, name: true },
    });

    if (!session) return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    if (authUser.role !== 'ADMIN' && session.hostId !== authUser.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();
    const {
      totalTickets = 15,
      basePointsWinning = 1000,
      maxScansWinning = null, // null for unlimited scans, or an integer
      triviaTimeLimit = 30,
      maxAttempts = 1, // Host-configured dynamic attempts for the winning QR
      winningQuestion,
      winningOptions,
      winningCorrectAnswer,
    } = body;

    const count = Math.max(1, Math.min(100, parseInt(totalTickets, 10) || 15));
    const attempts = Math.max(1, Math.min(10, parseInt(maxAttempts, 10) || 1));
    const timeLimit = Math.max(5, Math.min(180, parseInt(triviaTimeLimit, 10) || 30));
    const pointsWinning = Math.max(100, parseInt(basePointsWinning, 10) || 1000);

    // Default trivia challenge fallback if host didn't supply custom text
    const defaultQuestion = winningQuestion?.trim() || 'Which year was IEEE founded?';
    const defaultOptions = Array.isArray(winningOptions) && winningOptions.length >= 2
      ? winningOptions.map((o: any) => String(o).trim()).filter(Boolean)
      : ['1884', '1945', '1963', '1971'];
    const defaultCorrect = winningCorrectAnswer?.trim() || defaultOptions[0] || '1963';

    // Find current max ticketNumber in this session
    const lastTicket = await prisma.qrTicket.findFirst({
      where: { sessionId },
      orderBy: { ticketNumber: 'desc' },
      select: { ticketNumber: true },
    });

    // Check if session already has a winning ticket
    const existingWinningTicket = await prisma.qrTicket.findFirst({
      where: { sessionId, isWinning: true },
    });

    // Exactly ONE winning QR for the physical hunt
    // If no winning ticket exists, the first ticket in this batch will be the winning one
    const winningBatchIndex = existingWinningTicket ? -1 : 0;

    let startNum = (lastTicket?.ticketNumber ?? 0) + 1;
    const ticketsToCreate = [];

    for (let i = 0; i < count; i++) {
      const ticketNumber = startNum + i;
      const isWinning = i === winningBatchIndex;
      // Generate secure 10-char token
      const code = `TKT-${crypto.randomBytes(5).toString('hex').toUpperCase()}`;

      if (isWinning) {
        // The SINGLE winning Golden Ticket QR
        ticketsToCreate.push({
          sessionId,
          ticketNumber,
          code,
          isWinning: true,
          basePoints: pointsWinning,
          maxScans: maxScansWinning ? Math.max(1, parseInt(maxScansWinning, 10)) : null,
          scanCount: 0,
          isExpired: false,
          question: defaultQuestion,
          options: defaultOptions,
          correctAnswer: defaultCorrect,
          timeLimit,
          maxAttempts: attempts,
        });
      } else {
        // Decoy QR code — no question, no points. Tells user to keep searching.
        ticketsToCreate.push({
          sessionId,
          ticketNumber,
          code,
          isWinning: false,
          basePoints: 0,
          maxScans: null,
          scanCount: 0,
          isExpired: false,
          question: null,
          options: Prisma.DbNull,
          correctAnswer: null,
          timeLimit: 0,
          maxAttempts: 1,
        });
      }
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

// GET — List tickets for the session (Host / Admin only)
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const authUser = await getAuthUser(req);
    if (!authUser) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const sessionId = (await params).id;

    const session = await prisma.session.findUnique({
      where: { id: sessionId },
      select: { hostId: true },
    });

    if (!session) return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    if (authUser.role !== 'ADMIN' && session.hostId !== authUser.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

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
