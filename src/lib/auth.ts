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

/**
 * Robust authentication resolver for Route Handlers.
 * Checks request headers (from middleware) and safely falls back to reading
 * and verifying the HTTP-only JWT token directly from cookies.
 */
export async function getAuthUser(req?: Request): Promise<AuthPayload | null> {
  // 1. Check custom headers forwarded from middleware
  if (req) {
    const id = req.headers.get('x-user-id');
    const role = req.headers.get('x-user-role') as 'ADMIN' | 'HOST' | null;
    if (id && (role === 'ADMIN' || role === 'HOST')) {
      return {
        id,
        role,
        username: req.headers.get('x-user-name') || '',
        mustChangePass: false,
      };
    }
  }

  // 2. Direct cookie fallback if headers are stripped by reverse proxy or edge middleware
  try {
    const { cookies } = await import('next/headers');
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    if (token) {
      return await verifyToken(token);
    }
  } catch {
    // Ignore error if outside request context
  }

  return null;
}


