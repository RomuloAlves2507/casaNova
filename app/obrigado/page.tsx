'use client';

import Link from 'next/link';

export default function Obrigado() {
  return (
    <main className="min-h-screen bg-white flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center">
        {/* Um ícone de coração ou check animado ficaria legal aqui */}
        <div className="mb-8 inline-flex items-center justify-center w-24 h-24 bg-green-100 rounded-full">
          <span className="text-5xl">❤️</span>
        </div>

        <h1 className="text-4xl font-black text-gray-900 mb-4 tracking-tight">
          Muito obrigado!
        </h1>
        
        <p className="text-lg text-gray-600 mb-8 leading-relaxed">
          Seu presente foi recebido com muito carinho. 
          Cada detalhe da nossa casa nova tem um pouquinho de você!
        </p>

        <div className="space-y-4">
          <Link 
            href="/"
            className="block w-full bg-gray-900 text-white py-4 rounded-2xl font-bold hover:bg-gray-800 transition-all active:scale-95"
          >
            Voltar para a lista
          </Link>
          
          <p className="text-sm text-gray-400">
            Você receberá a confirmação por e-mail do Mercado Pago.
          </p>
        </div>
      </div>
    </main>
  );
}