import { MercadoPagoConfig, Preference } from 'mercadopago';

// Configura o cliente usando a variável de ambiente cadastrada na Vercel
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
        // Configuração para o site real na Vercel
        back_urls: {
          success: "https://derocasanova.vercel.app/obrigado",
          failure: "https://derocasanova.vercel.app",
          pending: "https://derocasanova.vercel.app/obrigado"
        },
        // Ativa o retorno automático agora que temos um domínio real
        auto_return: "approved",
        
        payment_methods: {
          installments: 12, // Permite parcelamento
        },
      }
    });

    // Retorna a URL do Checkout para o frontend
    return Response.json({ url: preference.init_point });
    
  } catch (error) {
    console.error("ERRO MERCADO PAGO:", error);
    return Response.json(
      { error: "Erro ao gerar pagamento", detalhes: error }, 
      { status: 500 }
    );
  }
}