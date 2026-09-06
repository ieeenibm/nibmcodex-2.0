import { SignJWT, jwtVerify, JWTPayload } from 'jose';

export interface AuthPayload extends JWTPayload {
  id: string;
  username: string;
  role: 'ADMIN' | 'HOST';
  mustChangePass: boolean;
}

function getSecret(): Uint8Array {
  const raw = process.env.JWT_SECRET;
  if (!raw && process.env.NODE_ENV === 'production') {
    throw new Error('FATAL: JWT_SECRET environment variable is required in production.');
  }
  return new TextEncoder().encode(raw || 'dev-only-fallback-secret-do-not-use-in-prod');
}

const secret = getSecret();

export async function signToken(payload: Record<string, unknown>) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(secret);
}

function isAuthPayload(payload: unknown): payload is AuthPayload {
  if (typeof payload !== 'object' || payload === null) return false;
  const p = payload as Record<string, unknown>;
  return (
    typeof p.id === 'string' &&
    typeof p.username === 'string' &&
    (p.role === 'ADMIN' || p.role === 'HOST') &&
    typeof p.mustChangePass === 'boolean'
  );
}

export async function verifyToken(token: string): Promise<AuthPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secret);
    if (!isAuthPayload(payload)) {
      return null;
    }
    return payload;
  } catch {
    return null;
  }
}

