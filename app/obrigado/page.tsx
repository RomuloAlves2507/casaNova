'use client';

// Importando a lista que você criou no outro arquivo
import { LISTA_PRESENTES } from './presentes'; 

export default function ListaPresentes() {
  
  const handlePresentear = async (nome: string, preco: number) => {
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, preco }),
      });
      
      const data = await response.json();

      if (data.url) {
        // Redireciona para o Mercado Pago
        window.location.href = data.url;
      } else {
        alert("Erro ao gerar link de pagamento.");
      }
    } catch (error) {
      console.error("Erro:", error);
      alert("Erro na conexão com o servidor.");
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Cabeçalho Personalizado */}
        <header className="text-center mb-16">
          <div className="inline-block px-4 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-bold mb-4 uppercase tracking-widest">
            Nossa Casa Nova
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-gray-900 mb-4 tracking-tight">
            Déborah & Romulo 🏠
          </h1>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
            Estamos começando uma nova etapa e ficaremos muito felizes em ter um pedacinho de cada amigo no nosso novo lar. 
            Escolha um item abaixo para nos presentear!
          </p>
          <div className="mt-6 flex justify-center gap-6 text-sm text-gray-400 font-medium">
            <span className="flex items-center gap-1">✅ Pagamento Seguro</span>
            <span className="flex items-center gap-1">✅ Pix ou Cartão</span>
          </div>
        </header>

        {/* Grade de Produtos Dinâmica */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {LISTA_PRESENTES.map((item) => (
            <div 
              key={item.id} 
              className="group bg-white rounded-3xl shadow-sm hover:shadow-2xl transition-all duration-300 border border-gray-100 flex flex-col overflow-hidden"
            >
              {/* Imagem do Produto */}
              <div className="relative overflow-hidden aspect-square">
                <img 
                  src={item.imagem} 
                  alt={item.nome} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                />
              </div>
              
              {/* Detalhes do Produto */}
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-lg font-bold text-gray-800 mb-2 leading-tight">
                  {item.nome}
                </h3>
                <div className="mt-auto">
                  <p className="text-2xl font-black text-blue-600 mb-4">
                    R$ {item.preco.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                  <button 
                    onClick={() => handlePresentear(item.nome, item.preco)}
                    className="w-full bg-gray-900 text-white py-4 rounded-2xl font-bold hover:bg-blue-600 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-gray-200 hover:shadow-blue-200"
                  >
                    Presentear
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Rodapé Simples */}
        <footer className="mt-20 text-center text-gray-400 text-sm">
          <p>Feito com ❤️ para nossa nova jornada.</p>
        </div>
      </div>
    </main>
  );
}