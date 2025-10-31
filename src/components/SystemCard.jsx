import React from "react";
import {SystemIcon} from "./SystemIcon"

export function SystemCard({ system }) {

    const isInDev = system.status === 'em desenvolvimento';

    const handleClick = () => {
        if (isInDev) {
            alert('Este sistema ainda está em desenvolvimento. Em breve estará disponível!');
            return;
        }
        window.location.href = system.url;
    };

    return (
        <div className="group relative overflow-hidden rounded-xl bg-slate-800 border border-slate-700 hover:border-slate-600 transition-all duration-300 hover:shadow-xl hover:shadow-slate-900/50">
            <div className={`absolute inset-0 bg-linear-to-br ${system.color} opacity-5 group-hover:opacity-10 transition-opacity`} />

            <div className="relative p-8">
                <div className="absolute top-4 right-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${isInDev
                        ? 'bg-yellow-500/20 text-yellow-300'
                        : 'bg-green-500/20 text-green-300'
                        }`}>
                        {system.status === 'em desenvolvimento' ? '⏳ Em desenvolvimento' : '✓ Ativo'}
                    </span>
                </div>

                <div className="mb-4">
                    <SystemIcon system={system}  />
                </div>

                <h3 className="text-xl font-bold text-white mb-2">{system.title}</h3>
                <p className="text-slate-400 text-sm mb-6">{system.description}</p>

                <button
                    onClick={handleClick}
                    disabled={isInDev}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 ${isInDev
                        ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                        : `bg-green-300 text-black hover:shadow-lg cursor-pointer hover:shadow-slate-900/50 hover:scale-105 active:scale-95`
                        }`}
                >
                    Acessar
                </button>
            </div>
        </div>
    );
}