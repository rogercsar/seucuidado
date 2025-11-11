import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { amount, description } = await req.json();
    const accessToken = process.env.MP_ACCESS_TOKEN;
    if (!accessToken) return NextResponse.json({ error: 'Access token não configurado' }, { status: 500 });

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const commission = Number(amount) * 0.10; // 10% de comissão da plataforma

    // Usar fetch direto para a API do Mercado Pago
    const response = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        items: [
          { title: description || 'Atendimento domiciliar', quantity: 1, currency_id: 'BRL', unit_price: Number(amount) },
        ],
        back_urls: {
          success: `${baseUrl}/success`,
          failure: `${baseUrl}/failure`,
          pending: `${baseUrl}/pending`,
        },
        notification_url: `${baseUrl}/api/mercadopago/webhook`,
        marketplace_fee: commission,
        auto_return: 'approved',
      }),
    });

    if (!response.ok) {
      throw new Error('Erro ao criar preferência');
    }

    const data = await response.json();
    return NextResponse.json({ id: data.id, init_point: data.init_point, commission });
  } catch (e) {
    return NextResponse.json({ error: 'Falha ao criar preferência' }, { status: 500 });
  }
}