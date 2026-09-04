import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

function generateJoinCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

export async function GET(req: Request) {
  try {
    const userId = req.headers.get('x-user-id');
    const role = req.headers.get('x-user-role');
    
    let sessions;
    if (role === 'ADMIN') {
      sessions = await prisma.session.findMany({
        orderBy: { id: 'desc' },
      });
    } else if (userId) {
      sessions = await prisma.session.findMany({
        where: { hostId: userId },
        orderBy: { id: 'desc' },
      });
    } else {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    return NextResponse.json(sessions);
  } catch (error) {
    console.error('Fetch sessions error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const userId = req.headers.get('x-user-id');
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { name, mode } = await req.json();
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
        mode: mode || 'COMPETITIVE',
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
