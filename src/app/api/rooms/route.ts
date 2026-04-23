import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get('date');

  if (!date) {
    return NextResponse.json({ error: 'Date is required' }, { status: 400 });
  }

  try {
    const rooms = await prisma.room.findMany({
      include: {
        bookings: {
          where: {
            date: date,
            status: { not: 'CANCELLED' }
          }
        },
        blockedTimes: {
          where: {
            date: date
          }
        }
      }
    });

    return NextResponse.json(rooms);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch rooms' }, { status: 500 });
  }
}
