import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { getAuthUser } from '@/lib/auth';

// GET — list all HOST users (admin only)
export async function GET(req: Request) {
  const authUser = await getAuthUser(req);
  if (!authUser || authUser.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const hosts = await prisma.user.findMany({
    where: { role: 'HOST' },
    select: { id: true, username: true, mustChangePass: true },
    orderBy: { username: 'asc' },
  });

  return NextResponse.json(hosts);
}

// POST — create a new host account (admin only)
export async function POST(req: Request) {
  const authUser = await getAuthUser(req);
  if (!authUser || authUser.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const { username, tempPassword } = await req.json();
    if (!username?.trim() || !tempPassword?.trim()) {
      return NextResponse.json({ error: 'Username and temporary password are required' }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({ where: { username } });
    if (existing) {
      return NextResponse.json({ error: 'Username already taken' }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(tempPassword, 10);
    const user = await prisma.user.create({
      data: { username, passwordHash, role: 'HOST', mustChangePass: true },
      select: { id: true, username: true, mustChangePass: true },
    });

    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    console.error('Create host error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
