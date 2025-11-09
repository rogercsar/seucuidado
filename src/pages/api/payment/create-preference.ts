import type { NextApiRequest, NextApiResponse } from 'next';
import client from '@/lib/mercadopago';
import { Preference } from 'mercadopago';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }

  try {
    const { title, unit_price, quantity } = req.body;
    const preferenceClient = new Preference(client);

    const preferenceData = {
      items: [
        {
          id: title || 'atendimento-cuidar-me', // Adicionando o ID obrigatório
          title: title || 'Atendimento Cuidar.me',
          description: 'Serviço de agendamento de profissional de saúde',
          unit_price: Number(unit_price) || 100,
          quantity: Number(quantity) || 1,
          currency_id: 'BRL',
        },
      ],
      back_urls: {
        success: `${req.headers.origin}/payment/success`,
        failure: `${req.headers.origin}/payment/failure`,
        pending: `${req.headers.origin}/payment/pending`,
      },
      auto_return: 'approved',
    };

    const response = await preferenceClient.create({ body: preferenceData });

    res.status(201).json({
      id: response.id,
      sandbox_init_point: response.sandbox_init_point,
    });

  } catch (error: any) {
    console.error(error);
    res.status(500).json({
      message: 'Failed to create payment preference',
      error: error.message,
    });
  }
}
