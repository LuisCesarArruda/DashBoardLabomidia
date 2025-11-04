import React from 'react'
import logo from "/LogoLabomidiaAtivo 1.png"


export function Header({ user, onLogout }) {
    return (
        <header className="border-b border-slate-700 bg-slate-800/50 backdrop-blur-sm sticky top-0 z-10">
            <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <img src={logo} alt="" srcSet="" className='w-10 h-10 text-white' />
                    <div>
                        <h1 className="text-2xl font-bold text-white">Plataforma Labomídia</h1>
                    </div>
                </div>

                
                {user && (
                    <div className="flex items-center gap-4">
                        <div className="text-right">
                            <p className="text-slate-300 text-sm">Bem-vindo,</p>
                            <p className="font-bold text-white">{user.nome}</p>
                        </div>
                        <button
                            onClick={onLogout}
                            className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition"
                        >
                            Sair
                        </button>
                    </div>
                )}
            </div>
        </header>
    );
}