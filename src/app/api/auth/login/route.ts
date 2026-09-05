import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { signToken } from '@/lib/auth';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const rawUser = body.username || body.email || '';
    const username = rawUser.toString().trim();
    const password = (body.password || '').toString();

    if (!username || !password) {
      return NextResponse.json({ error: 'Username and password required' }, { status: 400 });
    }

    let payload: any = null;

    // 1. Check Master Admin from ENV
    // Accepts either ADMIN_USERNAME or ADMIN_EMAIL (or defaults to 'admin' / 'codex2026')
    const configuredUser = (process.env.ADMIN_USERNAME || '').trim();
    const configuredEmail = (process.env.ADMIN_EMAIL || '').trim();
    const configuredPass = (process.env.ADMIN_PASSWORD || 'codex2026').trim();

    const inputLower = username.toLowerCase();
    const isMasterUser =
      (configuredUser && inputLower === configuredUser.toLowerCase()) ||
      (configuredEmail && inputLower === configuredEmail.toLowerCase()) ||
      (!configuredUser && !configuredEmail && inputLower === 'admin');

    if (isMasterUser && password === configuredPass) {
      payload = {
        id: 'master-admin-id',
        username: configuredUser || configuredEmail || 'admin',
        role: 'ADMIN',
        mustChangePass: false,
      };
    } else {
      // 2. Check Database for Host users (case-insensitive)
      const dbUser = await prisma.user.findFirst({
        where: {
          username: {
            equals: username,
            mode: 'insensitive',
          },
        },
      });
      if (!dbUser) {
        return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
      }

      const isValid = await bcrypt.compare(password, dbUser.passwordHash);
      if (!isValid) {
        return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
      }

      payload = {
        id: dbUser.id,
        username: dbUser.username,
        role: dbUser.role,
        mustChangePass: dbUser.mustChangePass,
      };
    }

    // Sign JWT
    const token = await signToken(payload);

    // Set HTTP-only cookie
    const cookieStore = await cookies();
    cookieStore.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24, // 24 hours
    });

    return NextResponse.json({ success: true, mustChangePass: payload.mustChangePass });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
