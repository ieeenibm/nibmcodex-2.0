import { NextResponse } from 'next/server';
import Ably from 'ably';

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
    const role = searchParams.get('role'); // 'host' for admin host console

    const client = new Ably.Rest(apiKey);

    // Host gets publish + subscribe + presence; participants get subscribe + presence
    const capabilities = role === 'host'
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
