import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    const id = resolvedParams.id;
    const { pricePerHour } = await request.json();

    const room = await prisma.room.update({
      where: { id },
      data: { pricePerHour: Number(pricePerHour) }
    });

    return NextResponse.json(room);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error al actualizar precio' }, { status: 500 });
  }
}
