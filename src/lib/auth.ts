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

export async function verifyToken(token: string): Promise<AuthPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload as AuthPayload;
  } catch {
    return null;
  }
}

