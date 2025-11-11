import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    // TODO: Validar assinatura e atualizar status de pagamento na tabela `transactions`
    console.log('Webhook Mercado Pago:', body);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: 'Falha no webhook' }, { status: 500 });
  }
}