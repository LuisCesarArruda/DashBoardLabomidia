import React from 'react'
export function InfoSection() {
    return (
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-8">
            <h3 className="text-lg font-bold text-white mb-4">ℹ️ Informações</h3>
            <div className="space-y-3 text-slate-300 text-sm">
                <p>
                    <span className="font-semibold text-white">Acervo de Filmes:</span> Sistema já em produção. Acesse para consultar o acervo completo.
                </p>
                <p>
                    <span className="font-semibold text-white">Outros sistemas:</span> Em desenvolvimento. Estarão disponíveis em breve nos seus respectivos URLs no Vercel.
                </p>
                <p>
                    <span className="font-semibold text-white">URLs dos sistemas:</span> Atualize as URLs dos sistemas na configuração do dashboard quando estiverem em produção.
                </p>
            </div>
        </div>
    )
}