import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { MercadoPagoConfig, Preference } from 'mercadopago';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { roomId, customerName, customerEmail, customerPhone, date, startTime, duration, totalPrice } = body;

    // First, save the booking as PENDING in our DB
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

    // If there's no access token, simulate a successful flow (local testing fallback)
    if (!process.env.MP_ACCESS_TOKEN) {
      return NextResponse.json({ init_point: `/reservar?status=approved&external_reference=${booking.id}` });
    }

    // MercadoPago setup
    const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN });
    const preference = new Preference(client);

    // Calculate 50% down payment
    const senaAmount = totalPrice * 0.5;

    // The base URL for redirects (production or local)
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://salas-de-ensayo-app.vercel.app';

    const result = await preference.create({
      body: {
        items: [
          {
            id: roomId,
            title: `Seña 50% - Reserva Sala de Ensayo`,
            description: `Reserva para el ${date} a las ${startTime}:00hs por ${duration}hs`,
            quantity: 1,
            unit_price: senaAmount,
            currency_id: 'ARS',
          }
        ],
        payer: {
          name: customerName,
          email: customerEmail || 'test@user.com' // MP requires email
        },
        back_urls: {
          success: `${baseUrl}/reservar?status=approved`,
          failure: `${baseUrl}/reservar?status=failure`,
          pending: `${baseUrl}/reservar?status=pending`
        },
        auto_return: 'approved',
        external_reference: booking.id // Crucial to link payment to this booking
      }
    });

    return NextResponse.json({ init_point: result.init_point });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error?.message || 'Failed to create booking', details: error?.stack || error }, { status: 500 });
  }
}
