import { MercadoPagoConfig, Preference } from 'mercadopago';

const client = new MercadoPagoConfig({ 
  accessToken: process.env.MP_ACCESS_TOKEN || '' 
});

export async function POST(request: Request) {
  try {
    const { nome, preco } = await request.json();

    const preference = await new Preference(client).create({
      body: {
        items: [
          {
            id: 'presente-casanova',
            title: nome,
            unit_price: Number(preco),
            quantity: 1,
            currency_id: 'BRL'
          }
        ],
        back_urls: {
          success: "https://derocasanova.vercel.app/obrigado",
          failure: "https://derocasanova.vercel.app",
          pending: "https://derocasanova.vercel.app/obrigado"
        },
        auto_return: "approved",
      }
    });

    return Response.json({ url: preference.init_point });
    
  } catch (error: unknown) {
    console.error("ERRO MERCADO PAGO:", error);
    return Response.json({ error: "Erro ao gerar pagamento" }, { status: 500 });
  }
}