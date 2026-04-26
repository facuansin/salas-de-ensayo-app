import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { roomId, date, startTime, duration, reason } = await request.json();

    const blockedTime = await prisma.blockedTime.create({
      data: {
        roomId,
        date,
        startTime: Number(startTime),
        duration: Number(duration),
        reason
      }
    });

    return NextResponse.json(blockedTime);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error al bloquear horario' }, { status: 500 });
  }
}
