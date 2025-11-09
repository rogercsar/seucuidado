import mercadopago from 'mercadopago';

const accessToken = process.env.MERCADO_PAGO_ACCESS_TOKEN;

if (!accessToken) {
  throw new Error('Missing Mercado Pago Access Token. Please check your environment variables.');
}

// Inicializa o SDK do Mercado Pago
mercadopago.configure({
  access_token: accessToken,
});

export default mercadopago;
