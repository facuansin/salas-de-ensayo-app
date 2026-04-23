import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { roomId, customerName, customerEmail, customerPhone, date, startTime, duration, totalPrice } = body;

    // TODO: Add MercadoPago integration here and create preference ID
    // For now we just create the booking directly.

    const booking = await prisma.booking.create({
      data: {
        roomId,
        customerName,
        customerEmail,
        customerPhone,
        date,
        startTime,
        duration,
        totalPrice,
        status: 'PENDING'
      }
    });

    return NextResponse.json(booking);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 });
  }
}
