import { NextResponse } from 'next/server';
import Ably from 'ably';
import { verifyToken } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const apiKey = process.env.ABLY_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'Ably API key not configured' }, { status: 503 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get('sessionId');
    if (!sessionId || !/^[a-zA-Z0-9_-]+$/.test(sessionId)) {
      return NextResponse.json({ error: 'Invalid or missing sessionId parameter' }, { status: 400 });
    }

    const clientId = searchParams.get('clientId') || `user-${Math.random().toString(36).substring(2, 9)}`;
    const roleParam = searchParams.get('role'); // 'host' for admin host console

    let isAuthorizedHost = false;
    if (roleParam === 'host') {
      // Securely verify host credentials from session cookie to prevent capability escalation
      const cookieHeader = req.headers.get('cookie') || '';
      const match = cookieHeader.match(/(?:^|;\s*)token=([^;]+)/);
      const tokenVal = match ? match[1] : null;

      if (tokenVal) {
        const payload = await verifyToken(tokenVal);
        if (payload) {
          if (payload.role === 'ADMIN') {
            isAuthorizedHost = true;
          } else {
            const session = await prisma.session.findUnique({
              where: { id: sessionId },
              select: { hostId: true },
            });
            if (session?.hostId === payload.id) {
              isAuthorizedHost = true;
            }
          }
        }
      }
    }

    const client = new Ably.Rest(apiKey);

    // Only verified hosts receive publish capabilities; all others are strictly subscribe + presence
    const capabilities = isAuthorizedHost
      ? ['publish', 'subscribe', 'presence'] as const
      : ['subscribe', 'presence'] as const;

    const tokenRequestData = await client.auth.createTokenRequest({
      clientId,
      capability: {
        [`session:${sessionId}`]: [...capabilities],
      } as Record<string, Ably.capabilityOp[]>,
    });

    return NextResponse.json(tokenRequestData);
  } catch (error) {
    console.error('[Ably Auth Error]:', error);
    return NextResponse.json({ error: 'Failed to create Ably token request' }, { status: 500 });
  }
}
