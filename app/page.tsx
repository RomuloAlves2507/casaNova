'use client';

import { useState, useEffect } from 'react';

interface Presente {
  id: string;
  nome: string;
  preco: number;
  imagem: string;
  status: string;
}

export default function Home() {
  // --- ESTADOS ---
  const [presentes, setPresentes] = useState<Presente[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [busca, setBusca] = useState('');
  const [filtroPreco, setFiltroPreco] = useState('todos');

  // Estados do Modal de Reserva
  const [modalAberto, setModalAberto] = useState(false);
  const [itemSelecionado, setItemSelecionado] = useState<Presente | null>(null);
  const [nomeConvidado, setNomeConvidado] = useState('');
  const [telefoneConvidado, setTelefoneConvidado] = useState('');
  const [quantidadeCota, setQuantidadeCota] = useState(1);
  const [enviando, setEnviando] = useState(false);

  // --- BUSCA DADOS DA PLANILHA ---
  useEffect(() => {
    async function buscarPresentes() {
      try {
        const response = await fetch('/api/presentes');
        const data = await response.json();
        if (Array.isArray(data)) setPresentes(data);
      } catch (error) {
        console.error("Erro ao carregar:", error);
      } finally {
        setCarregando(false);
      }
    }
    buscarPresentes();
  }, []);

  // --- FUNÇÕES DE AÇÃO ---
  const abrirModalReserva = (item: Presente) => {
    setItemSelecionado(item);
    setQuantidadeCota(1); // Reseta a cota
    setModalAberto(true);
  };

  const finalizarReserva = async (metodo: 'MercadoPago' | 'Pessoalmente') => {
    if (!nomeConvidado || !telefoneConvidado) {
      alert("Por favor, preencha seu nome e telefone para que possamos te agradecer!");
      return;
    }

    setEnviando(true);
    const valorFinal = (itemSelecionado?.preco || 0) * quantidadeCota;

    try {
      const response = await fetch('/api/reservar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          idProduto: itemSelecionado?.id,
          nome: nomeConvidado,
          telefone: telefoneConvidado,
          metodo,
          produtoNome: itemSelecionado?.nome,
          valorTotal: valorFinal,
          quantidade: quantidadeCota,
          isCota: itemSelecionado?.status.toLowerCase() === 'cota'
        }),
      });

      const data = await response.json();

      if (metodo === 'MercadoPago' && data.url) {
        window.location.assign(data.url);
      } else {
        alert(`Tudo certo, ${nomeConvidado.split(' ')[0]}! Reserva confirmada. Muito obrigado! ❤️`);
        setModalAberto(false);
        window.location.reload(); 
      }
    } catch (error) {
      alert("Erro ao processar. Tente novamente ou nos avise!");
    } finally {
      setEnviando(false);
    }
  };

  // --- FILTRAGEM E ORDENAÇÃO ---
  const presentesFiltrados = presentes
    .filter((item) => {
      const combinaNome = item.nome.toLowerCase().includes(busca.toLowerCase());
      let combinaPreco = true;
      if (filtroPreco === 'ate100') combinaPreco = item.preco <= 100;
      else if (filtroPreco === '100a500') combinaPreco = item.preco > 100 && item.preco <= 500;
      else if (filtroPreco === 'acima500') combinaPreco = item.preco > 500;
      return combinaNome && combinaPreco;
    })
    .sort((a, b) => {
      if (a.status === 'Reservado' && b.status !== 'Reservado') return 1;
      if (a.status !== 'Reservado' && b.status === 'Reservado') return -1;
      return 0;
    });

  return (
    <main className="min-h-screen bg-[#FFFAFA] relative overflow-hidden text-[#191970] py-12 px-4">
      
      {/* Imagem de Fundo (Rosa Azul) */}
      <div 
        className="fixed inset-0 z-0 opacity-[0.03] pointer-events-none"
        style={{ backgroundImage: "url('/midia/flores.jpg')", backgroundSize: 'cover', backgroundPosition: 'center' }}
      />

      <div className="relative z-10 max-w-6xl mx-auto">
        <header className="text-center mb-12">
          <div className="inline-block px-4 py-1 rounded-full bg-[#F0FFF0] text-[#191970] text-xs font-bold mb-4 uppercase tracking-[0.2em]">
            Nossa Casa Nova
          </div>
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-[#191970] mb-4">Romulo & Déborah</h1>
          <p className="text-lg text-[#191970]/70 italic">"Escolha um item para nos ajudar a construir nosso novo lar."</p>
        </header>

        {/* FILTROS */}
        <div className="flex flex-col md:flex-row gap-4 mb-12 bg-[#F0FFF0]/50 p-6 rounded-3xl border border-[#191970]/5 backdrop-blur-sm">
          <input 
            type="text" placeholder="Buscar presente..." 
            className="flex-grow p-4 rounded-2xl border-none bg-white text-[#191970] shadow-sm"
            value={busca} onChange={(e) => setBusca(e.target.value)}
          />
          <select 
            className="md:w-64 p-4 rounded-2xl border-none bg-white text-[#191970] shadow-sm cursor-pointer"
            value={filtroPreco} onChange={(e) => setFiltroPreco(e.target.value)}
          >
            <option value="todos">Todos os preços</option>
            <option value="ate100">Até R$ 100</option>
            <option value="100a500">R$ 100 a R$ 500</option>
            <option value="acima500">Acima de R$ 500</option>
          </select>
        </div>

        {/* LISTAGEM */}
        {carregando ? (
          <div className="text-center py-20 animate-pulse text-xl">Preparando a lista... 🏠</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {presentesFiltrados.map((item) => {
              const isReservado = item.status.toLowerCase() === 'reservado';
              const isCota = item.status.toLowerCase() === 'cota';

              return (
                <div key={item.id} className={`group relative rounded-[2.5rem] transition-all duration-500 border flex flex-col overflow-hidden ${
                  isReservado ? 'bg-gray-100/50 grayscale border-gray-200' : 'bg-[#F0FFF0]/85 backdrop-blur-md shadow-sm border-[#191970]/5'
                }`}>
                  <div className="relative aspect-square p-6">
                    <img src={item.imagem} alt={item.nome} className="w-full h-full object-contain" />
                    {isCota && !isReservado && (
                      <span className="absolute top-4 right-4 bg-[#191970] text-white text-[10px] px-3 py-1 rounded-full uppercase tracking-tighter">Cota</span>
                    )}
                  </div>

                  <div className="p-8 flex flex-col flex-grow text-center">
                    <h3 className={`text-lg font-semibold mb-3 min-h-[3rem] ${isReservado ? 'text-gray-500' : 'text-[#191970]'}`}>{item.nome}</h3>
                    <div className="mt-auto">
                      <p className={`text-2xl font-bold mb-5 ${isReservado ? 'text-gray-400' : 'text-[#191970]'}`}>R$ {item.preco.toFixed(2)}</p>
                      <button 
                        disabled={isReservado}
                        onClick={() => abrirModalReserva(item)}
                        className={`w-full py-4 rounded-2xl font-bold transition-all ${
                          isReservado ? 'bg-gray-300 text-gray-500' : 'bg-[#191970] text-white hover:bg-[#191970]/90 shadow-md'
                        }`}
                      >
                        {isReservado ? 'Reservado' : 'Presentear'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* --- MODAL DE RESERVA --- */}
        {modalAberto && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#191970]/40 backdrop-blur-md">
            <div className="bg-[#FFFAFA] w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl border border-[#F0FFF0] animate-in fade-in zoom-in duration-300">
              <h2 className="text-2xl font-bold text-[#191970] mb-1">Quase lá! 🏠</h2>
              <p className="text-[#191970]/60 mb-6 text-sm">Preencha seus dados para reservarmos seu presente.</p>
              
              <div className="space-y-4">
                <input 
                  type="text" placeholder="Seu Nome" 
                  className="w-full p-4 rounded-2xl bg-[#F0FFF0] border-none text-[#191970]"
                  value={nomeConvidado} onChange={(e) => setNomeConvidado(e.target.value)}
                />
                <input 
                  type="tel" placeholder="Seu WhatsApp" 
                  className="w-full p-4 rounded-2xl bg-[#F0FFF0] border-none text-[#191970]"
                  value={telefoneConvidado} onChange={(e) => setTelefoneConvidado(e.target.value)}
                />

                {/* Se for cota, mostra o seletor de quantidade */}
                {itemSelecionado?.status.toLowerCase() === 'cota' && (
                  <div className="bg-[#191970]/5 p-4 rounded-2xl flex items-center justify-between">
                    <span className="text-sm font-semibold">Quantidade:</span>
                    <div className="flex items-center gap-4">
                      <button onClick={() => setQuantidadeCota(Math.max(1, quantidadeCota - 1))} className="w-8 h-8 rounded-full bg-white shadow-sm">-</button>
                      <span className="font-bold">{quantidadeCota}</span>
                      <button onClick={() => setQuantidadeCota(quantidadeCota + 1)} className="w-8 h-8 rounded-full bg-white shadow-sm">+</button>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-8 flex flex-col gap-3">
                <button 
                  disabled={enviando} onClick={() => finalizarReserva('MercadoPago')}
                  className="bg-[#191970] text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2"
                >
                  {enviando ? 'Processando...' : `Pagar R$ ${(itemSelecionado!.preco * quantidadeCota).toFixed(2)} Online`}
                </button>
                <button 
                  disabled={enviando} onClick={() => finalizarReserva('Pessoalmente')}
                  className="bg-[#F0FFF0] text-[#191970] py-4 rounded-2xl font-bold border border-[#191970]/10"
                >
                  Vou entregar em mãos
                </button>
                <button onClick={() => setModalAberto(false)} className="text-[#191970]/40 text-xs mt-2 underline">Cancelar</button>
              </div>
            </div>
          </div>
        )}

        <footer className="mt-24 text-center text-[#191970]/50 text-xs font-medium tracking-widest uppercase">
          Feito com ❤️ para nossa nova jornada
        </footer>
      </div>
    </main>
  );
}