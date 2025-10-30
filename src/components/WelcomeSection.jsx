import React from 'react'

export function WelcomeSection() {
    return (
        <div className="mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Bem-vindo ao Sistema do Labomidia</h2>
            <p className="text-slate-300 max-w-2xl">
                Acesse todos os sistemas disponíveis do laboratório a partir desta central. Cada sistema está em produção e pode ser acessado diretamente através dos cards abaixo.
            </p>
        </div>
    );
}