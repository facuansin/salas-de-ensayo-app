import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const blocks = await prisma.blockedTime.findMany({
      include: { room: true },
      orderBy: [{ date: 'asc' }, { startTime: 'asc' }]
    });
    return NextResponse.json(blocks);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch blocked times' }, { status: 500 });
  }
}
