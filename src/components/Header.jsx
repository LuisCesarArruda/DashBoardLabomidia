import React from 'react'
import { Settings } from 'lucide-react';
import logo from "../assets/IconeUniforBrancoAtivo3.png"

export function Header() {
    return (
        <header className="border-b border-slate-700 bg-slate-800/50 backdrop-blur-sm sticky top-0 z-10">
            <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <img src={logo} alt="" srcset="" className='w-10 h-10' />
                    <div>
                        <h1 className="text-2xl font-bold text-white">Sistema do Labomidia</h1>
                        <p className="text-sm text-slate-400">Hub de acesso aos sistemas</p>
                    </div>
                </div>
            </div>
        </header>
    );
}