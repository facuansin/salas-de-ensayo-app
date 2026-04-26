import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { MercadoPagoConfig, Payment } from 'mercadopago';

export async function POST(request: Request) {
  try {
    const url = new URL(request.url);
    const type = url.searchParams.get('type') || request.headers.get('x-type');
    
    // MP Webhooks usually send data in JSON with type="payment"
    const body = await request.json();
    
    // If it's not a payment notification or type is wrong, ignore it safely
    if (type !== 'payment' && body.type !== 'payment') {
      return NextResponse.json({ success: true });
    }

    const paymentId = body?.data?.id;
    if (!paymentId) return NextResponse.json({ success: true });

    // Validate the payment with MP API
    const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN || '' });
    const payment = new Payment(client);
    
    const paymentData = await payment.get({ id: paymentId });

    // If payment is approved, update our database
    if (paymentData.status === 'approved' && paymentData.external_reference) {
      const bookingId = paymentData.external_reference;

      // Update booking status to CONFIRMED
      await prisma.booking.update({
        where: { id: bookingId },
        data: { 
          status: 'CONFIRMED',
          paymentId: String(paymentId)
        }
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}
