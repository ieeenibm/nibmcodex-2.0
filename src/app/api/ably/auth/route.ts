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
    if (!sessionId) {
      return NextResponse.json({ error: 'sessionId parameter is required' }, { status: 400 });
    }

    const clientId = searchParams.get('clientId') || `user-${Math.random().toString(36).substring(2, 9)}`;

    const client = new Ably.Rest(apiKey);
    const tokenRequestData = await client.auth.createTokenRequest({
      clientId,
      capability: {
        [`session:${sessionId}`]: ['subscribe', 'presence'],
      },
    });

    return NextResponse.json(tokenRequestData);
  } catch (error) {
    console.error('[Ably Auth Error]:', error);
    return NextResponse.json({ error: 'Failed to create Ably token request' }, { status: 500 });
  }
}
