import { MercadoPagoConfig } from 'mercadopago';

const accessToken = process.env.MERCADO_PAGO_ACCESS_TOKEN;

if (!accessToken) {
  throw new Error('Missing Mercado Pago Access Token. Please check your environment variables.');
}

// Inicializa o cliente do Mercado Pago
const client = new MercadoPagoConfig({
  accessToken,
  options: {
    timeout: 5000,
  }
});

export default client;
