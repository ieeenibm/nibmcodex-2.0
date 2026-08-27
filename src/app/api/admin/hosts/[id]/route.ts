import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// DELETE — remove a host account (admin only)
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const role = req.headers.get('x-user-role');
  if (role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const userId = (await params).id;

    // Prevent deleting non-HOST users
    const user = await prisma.user.findUnique({ where: { id: userId }, select: { role: true } });
    if (!user) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    if (user.role !== 'HOST') return NextResponse.json({ error: 'Cannot delete this account' }, { status: 400 });

    // Sessions and their data cascade-delete automatically
    await prisma.user.delete({ where: { id: userId } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete host error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
