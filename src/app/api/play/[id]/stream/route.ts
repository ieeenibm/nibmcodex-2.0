import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

async function getSessionState(sessionId: string) {
  const session = await prisma.session.findUnique({
    where: { id: sessionId },
    select: {
      status: true,
      mode: true,
      activeQuestionId: true,
      questionStartedAt: true,
    },
  });
  if (!session) return null;

  let activeQuestion = null;
  if (session.activeQuestionId) {
    // Do NOT expose correctAnswer to the client
    activeQuestion = await prisma.question.findUnique({
      where: { id: session.activeQuestionId },
      select: { id: true, type: true, text: true, options: true, timeLimit: true, maxAnswers: true },
    });
  }

  return {
    status: session.status,
    mode: session.mode,
    activeQuestion,
    questionStartedAt: session.questionStartedAt?.toISOString() ?? null,
    serverTime: new Date().toISOString(),
  };
}

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const sessionId = (await params).id;
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      const send = (data: object) => {
        try {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
        } catch {
          // Controller already closed
        }
      };

      const sendPing = () => {
        try {
          controller.enqueue(encoder.encode(`: ping\n\n`));
        } catch {
          // Closed
        }
      };

      // Always send current state immediately on connect
      const initial = await getSessionState(sessionId);
      if (!initial) {
        send({ error: 'Session not found' });
        controller.close();
        return;
      }
      send(initial);

      if (initial.status === 'ENDED') {
        controller.close();
        return;
      }

      // Track status, activeQuestion id, and startedAt timestamp
      let lastKey = `${initial.status}:${initial.activeQuestion?.id ?? 'null'}:${initial.questionStartedAt ?? 'null'}`;
      const MAX_TICKS = 20; // ~20s lifetime before clean reconnect

      for (let tick = 0; tick < MAX_TICKS; tick++) {
        await new Promise<void>(r => setTimeout(r, 1000));

        const state = await getSessionState(sessionId);
        if (!state) break;

        const key = `${state.status}:${state.activeQuestion?.id ?? 'null'}:${state.questionStartedAt ?? 'null'}`;
        if (key !== lastKey) {
          lastKey = key;
          send(state);
        } else if (tick % 5 === 0) {
          sendPing();
        }

        if (state.status === 'ENDED') break;
      }

      controller.close(); // Browser EventSource will cleanly reconnect
    },
    cancel() {
      // Client disconnected
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
      'X-Accel-Buffering': 'no',
    },
  });
}
