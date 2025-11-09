import type { NextApiRequest, NextApiResponse } from 'next';
import mercadopago from '@/lib/mercadopago';
import { PreferenceCreateData } from 'mercadopago/dist/clients/preference/create/types';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }

  try {
    // No futuro, receberemos os dados do profissional e do agendamento via req.body
    const { title, unit_price, quantity } = req.body;

    const preference: PreferenceCreateData = {
      items: [
        {
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
      // Futuramente, podemos adicionar um webhook para receber notificações de pagamento
      // notification_url: `${req.headers.origin}/api/payment/webhook`,
    };

    const response = await mercadopago.preferences.create(preference);

    // Retorna o ID da preferência e o link para o sandbox
    res.status(201).json({
      id: response.body.id,
      sandbox_init_point: response.body.sandbox_init_point,
    });

  } catch (error: any) {
    console.error(error);
    res.status(500).json({
      message: 'Failed to create payment preference',
      error: error.message,
    });
  }
}
