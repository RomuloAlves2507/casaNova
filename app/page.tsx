'use client';

import { useState } from 'react';
import { LISTA_PRESENTES } from './presentes'; 

export default function Home() {
  // Estados para os filtros
  const [busca, setBusca] = useState('');
  const [filtroPreco, setFiltroPreco] = useState('todos');

  const handlePresentear = async (nome: string, preco: number) => {
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, preco }),
      });
      
      const data = await response.json();

      if (data.url) {
        window.location.assign(data.url); // Usei assign para evitar o erro do VS Code
      } else {
        alert("Erro ao gerar link de pagamento.");
      }
    } catch (error) {
      alert("Erro na conexão com o servidor.");
    }
  };

  // Lógica de filtragem
  const presentesFiltrados = LISTA_PRESENTES.filter((item) => {
    const combinaNome = item.nome.toLowerCase().includes(busca.toLowerCase());
    
    let combinaPreco = true;
    if (filtroPreco === 'ate100') combinaPreco = item.preco <= 100;
    else if (filtroPreco === '100a500') combinaPreco = item.preco > 100 && item.preco <= 500;
    else if (filtroPreco === 'acima500') combinaPreco = item.preco > 500;

    return combinaNome && combinaPreco;
  });

  return (
    <main className="min-h-screen bg-[#FFFAFA] relative overflow-hidden text-[#191970] py-12 px-4">
      
      {/* Imagem de Fundo Sutil */}
      <div 
        className="fixed inset-0 z-0 opacity-[0.03] pointer-events-none"
        style={{ 
          backgroundImage: "url('/midia/flores.jpg')", 
          backgroundSize: 'cover',
          backgroundPosition: 'center' 
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto">
        <header className="text-center mb-12">
          <div className="inline-block px-4 py-1 rounded-full bg-[#F0FFF0] text-[#191970] text-xs font-bold mb-4 uppercase tracking-[0.2em]">
            Nossa Casa Nova
          </div>
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-[#191970] mb-4">
            Romulo & Déborah
          </h1>
          <p className="text-lg text-[#191970]/70 italic"> "Escolha um item para nos ajudar a construir nosso novo lar."</p>
        </header>

        {/* BARRA DE FILTROS */}
        <div className="flex flex-col md:flex-row gap-4 mb-12 bg-[#F0FFF0]/50 p-6 rounded-3xl border border-[#191970]/5 backdrop-blur-sm">
          <div className="flex-grow">
            <input 
              type="text"
              placeholder="Buscar presente pelo nome..."
              className="w-full p-4 rounded-2xl border-none focus:ring-2 focus:ring-[#191970]/20 bg-white text-[#191970] placeholder-[#191970]/40 shadow-sm"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
            />
          </div>
          <div className="md:w-64">
            <select 
              className="w-full p-4 rounded-2xl border-none focus:ring-2 focus:ring-[#191970]/20 bg-white text-[#191970] shadow-sm appearance-none cursor-pointer"
              value={filtroPreco}
              onChange={(e) => setFiltroPreco(e.target.value)}
            >
              <option value="todos">Todos os preços</option>
              <option value="ate100">Até R$ 100,00</option>
              <option value="100a500">R$ 100,00 a R$ 500,00</option>
              <option value="acima500">Acima de R$ 500,00</option>
            </select>
          </div>
        </div>

        {/* LISTAGEM */}
        {presentesFiltrados.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {presentesFiltrados.map((item) => (
              <div key={item.id} className="group bg-[#F0FFF0]/85 backdrop-blur-md rounded-[2.5rem] shadow-sm hover:shadow-xl transition-all duration-500 border border-[#191970]/5 flex flex-col overflow-hidden">
                <div className="relative overflow-hidden aspect-square p-6">
                  <img src={item.imagem} alt={item.nome} className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700" />
                </div>
                <div className="p-8 flex flex-col flex-grow text-center">
                  <h3 className="text-lg font-semibold text-[#191970] mb-3 leading-tight min-h-[3rem] flex items-center justify-center">{item.nome}</h3>
                  <div className="mt-auto">
                    <p className="text-2xl font-bold text-[#191970] mb-5">R$ {item.preco.toFixed(2)}</p>
                    <button onClick={() => handlePresentear(item.nome, item.preco)} className="w-full bg-[#191970] text-white py-4 rounded-2xl font-bold hover:bg-[#191970]/90 transition-all duration-300">
                      Presentear
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-[#191970]/50 text-xl font-medium">Nenhum presente encontrado com esse filtro. 🏠</p>
          </div>
        )}

        <footer className="mt-24 text-center">
          <p className="text-[#191970]/50 text-sm font-medium tracking-wide">FEITO COM ❤️ PARA A NOSSA NOVA JORNADA</p>
        </footer>
      </div>
    </main>
  );
}