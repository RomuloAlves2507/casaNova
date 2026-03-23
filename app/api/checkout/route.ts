import { MercadoPagoConfig, Preference } from 'mercadopago';

const client = new MercadoPagoConfig({ 
  accessToken: process.env.MP_ACCESS_TOKEN || '' 
});

export async function POST(request) {
  try {
    const { nome, preco } = await request.json();

    const preference = await new Preference(client).create({
      body: {
        items: [
          {
            id: 'item-presente',
            title: nome,
            unit_price: Number(preco),
            quantity: 1,
            currency_id: 'BRL'
          }
        ],
        // Desativamos temporariamente para o localhost não dar erro
        /*
        back_urls: {
          success: "http://localhost:3000/obrigado",
          failure: "http://localhost:3000",
          pending: "http://localhost:3000/obrigado"
        },
        auto_return: "approved",
        */
      }
    });

    return Response.json({ url: preference.init_point });
    
  } catch (error) {
    console.error("ERRO DETALHADO:", error);
    return Response.json({ error: "Erro interno" }, { status: 500 });
  }
}