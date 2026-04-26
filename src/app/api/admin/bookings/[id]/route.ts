import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    const body = await request.json();
    
    const updateData: any = {};
    if (body.status !== undefined) updateData.status = body.status;
    if (body.date !== undefined) updateData.date = body.date;
    if (body.startTime !== undefined) updateData.startTime = Number(body.startTime);
    if (body.duration !== undefined) updateData.duration = Number(body.duration);
    if (body.totalPrice !== undefined) updateData.totalPrice = Number(body.totalPrice);
    
    const updated = await prisma.booking.update({
      where: { id: resolvedParams.id },
      data: updateData
    });
    
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update booking' }, { status: 500 });
  }
}
