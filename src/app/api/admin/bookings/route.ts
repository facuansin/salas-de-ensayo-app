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

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { roomId, date, startTime, duration, bandMembers, customerName, customerPhone, totalPrice } = body;
    
    const booking = await prisma.booking.create({
      data: {
        roomId,
        date,
        startTime,
        duration,
        bandMembers: bandMembers ? Number(bandMembers) : 1,
        customerName,
        customerPhone,
        totalPrice,
        customerEmail: 'manual@admin.com',
        status: 'CONFIRMED'
      }
    });
    return NextResponse.json(booking);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create manual booking' }, { status: 500 });
  }
}
