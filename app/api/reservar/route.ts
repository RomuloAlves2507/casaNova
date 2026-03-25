import { NextResponse } from 'next/server';
import { carregarPlanilha } from '../googleSheets'; // Ajuste o caminho conforme seu projeto
import { MercadoPagoConfig, Preference } from 'mercadopago';

// Configura o Mercado Pago com o seu Token de Produção
const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN || '',
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { idProduto, nome, telefone, metodo, produtoNome, valorTotal, quantidade, isCota } = body;

    // 1. Conectar com a Planilha
    const doc = await carregarPlanilha();
    
    // --- PARTE A: Gravar na aba "Presenteados" ---
    const abaPresenteados = doc.sheetsByTitle['Presenteados'];
    await abaPresenteados.addRow({
      'Id': idProduto,
      'Produto_Ganho': produtoNome,
      'Nome': nome,
      'Telefone': telefone,
      'Forma_Entrega': metodo === 'MercadoPago' ? 'Online (Mercado Pago)' : 'Em mãos / Já comprado',
      'Data': new Date().toLocaleString('pt-BR'),
      'Valor_Total': valorTotal
    });

    // --- PARTE B: Atualizar status na aba "Lista" ---
    // Se não for cota, precisamos marcar como "Reservado" para ninguém mais comprar
    if (!isCota) {
      const abaLista = doc.sheetsByTitle['Lista'];
      const linhas = await abaLista.getRows();
      const linhaProduto = linhas.find(row => row.get('Id') === idProduto);

      if (linhaProduto) {
        linhaProduto.set('Status', 'Reservado');
        await linhaProduto.save();
      }
    }

    // --- PARTE C: Gerar link de pagamento (se necessário) ---
    if (metodo === 'MercadoPago') {
      const preference = await new Preference(client).create({
        body: {
          items: [
            {
              id: idProduto,
              title: isCota ? `${produtoNome} (Cota x${quantidade})` : produtoNome,
              unit_price: Number(valorTotal),
              quantity: 1,
              currency_id: 'BRL',
            },
          ],
          back_urls: {
            success: "https://derocasanova.vercel.app/obrigado",
            failure: "https://derocasanova.vercel.app",
            pending: "https://derocasanova.vercel.app/obrigado",
          },
          auto_return: "approved",
        },
      });

      return NextResponse.json({ url: preference.init_point });
    }

    // Se for entrega em mãos, apenas confirma o sucesso
    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('ERRO NA RESERVA:', error);
    return NextResponse.json({ error: 'Erro ao processar reserva' }, { status: 500 });
  }
}