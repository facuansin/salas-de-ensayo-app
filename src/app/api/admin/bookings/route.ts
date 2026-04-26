import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const bookings = await prisma.booking.findMany({
      include: {
        room: true
      },
      orderBy: [
        { date: 'desc' },
        { startTime: 'desc' }
      ]
    });
    return NextResponse.json(bookings);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 });
  }
}
