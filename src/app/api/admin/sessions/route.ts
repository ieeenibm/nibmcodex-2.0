import { NextResponse } from 'next/server';
import { prisma, ensureDatabaseSchema } from '@/lib/prisma';
import { getAuthUser } from '@/lib/auth';

function generateJoinCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

export async function GET(req: Request) {
  try {
    await ensureDatabaseSchema();

    const authUser = await getAuthUser(req);
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: userId, role } = authUser;

    let sessions;
    try {
      if (role === 'ADMIN') {
        sessions = await prisma.session.findMany({
          orderBy: { createdAt: 'desc' },
          include: {
            questions: { select: { id: true } },
            participants: { select: { id: true } },
          },
        });
      } else {
        sessions = await prisma.session.findMany({
          where: { hostId: userId },
          orderBy: { createdAt: 'desc' },
          include: {
            questions: { select: { id: true } },
            participants: { select: { id: true } },
          },
        });
      }
    } catch (queryErr: any) {
      // Auto-recover from P2022 (ColumnNotFound e.g. Session.gameType) by forcing schema sync and retrying
      if (queryErr?.code === 'P2022') {
        console.warn('[Prisma] Missing column detected, applying auto-migration...');
        await ensureDatabaseSchema();
        if (role === 'ADMIN') {
          sessions = await prisma.session.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
              questions: { select: { id: true } },
              participants: { select: { id: true } },
            },
          });
        } else {
          sessions = await prisma.session.findMany({
            where: { hostId: userId },
            orderBy: { createdAt: 'desc' },
            include: {
              questions: { select: { id: true } },
              participants: { select: { id: true } },
            },
          });
        }
      } else {
        throw queryErr;
      }
    }

    return NextResponse.json(sessions);
  } catch (error) {
    console.error('Fetch sessions error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await ensureDatabaseSchema();

    const authUser = await getAuthUser(req);
    if (!authUser) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const userId = authUser.id;

    const { name, gameType } = await req.json();
    if (!name) return NextResponse.json({ error: 'Session name is required' }, { status: 400 });

    const joinCode = generateJoinCode();

    let actualHostId = userId;
    
    // If master admin creates a session, we need to map it to a user. 
    // Since master admin isn't in DB, let's create a placeholder host if needed.
    if (userId === 'master-admin-id') {
      const adminUsername = (process.env.ADMIN_USERNAME || process.env.ADMIN_EMAIL || 'admin').trim();
      let masterUser = await prisma.user.findFirst({
        where: {
          OR: [
            { role: 'ADMIN' },
            { username: adminUsername },
          ],
        },
      });
      if (!masterUser) {
        masterUser = await prisma.user.create({
          data: {
            username: adminUsername,
            passwordHash: 'none',
            role: 'ADMIN',
            mustChangePass: false,
          },
        });
      }
      actualHostId = masterUser.id;
    }

    const newSession = await prisma.session.create({
      data: {
        name,
        mode: 'COMPETITIVE',
        gameType: gameType || 'QUIZ',
        joinCode,
        hostId: actualHostId,
      },
    });

    return NextResponse.json(newSession);
  } catch (error) {
    console.error('Create session error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
