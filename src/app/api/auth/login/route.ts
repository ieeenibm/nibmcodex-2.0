import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { signToken } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json({ error: 'Username and password required' }, { status: 400 });
    }

    let payload: any = null;

    // 1. Check Master Admin from ENV
    const masterUser = process.env.ADMIN_USERNAME || 'admin';
    const masterPass = process.env.ADMIN_PASSWORD || 'codex2026';

    if (username === masterUser && password === masterPass) {
      payload = {
        id: 'master-admin-id',
        username,
        role: 'ADMIN',
        mustChangePass: false,
      };
    } else {
      // 2. Check Database for Host users
      const dbUser = await prisma.user.findUnique({ where: { username } });
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
