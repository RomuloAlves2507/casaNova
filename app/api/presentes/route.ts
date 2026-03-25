import { NextResponse } from 'next/server';
import { carregarPlanilha } from '../googleSheets';

export async function GET() {
  try {
    const doc = await carregarPlanilha();
    // Seleciona a aba chamada "Lista" (certifique-se de que o nome na planilha é exatamente esse)
    const sheet = doc.sheetsByTitle['Lista'];
    
    // Carrega todas as linhas
    const rows = await sheet.getRows();

    // Mapeia os dados para o formato que o seu site já usa
    const presentes = rows.map(row => ({
      id: row.get('Id'),
      nome: row.get('Produto'),
      preco: parseFloat(row.get('Valor').replace('R$', '').replace('.', '').replace(',', '.').trim()),
      imagem: row.get('Imagem'),
      status: row.get('Status') || 'Disponível', // Default se estiver vazio
    }));

    // Retorna os dados com um cabeçalho para evitar cache excessivo durante os testes
    return NextResponse.json(presentes, {
      headers: {
        'Cache-Control': 'no-store, max-age=0',
      },
    });

  } catch (error) {
    console.error('Erro ao ler planilha:', error);
    return NextResponse.json({ error: 'Falha ao buscar presentes' }, { status: 500 });
  }
}