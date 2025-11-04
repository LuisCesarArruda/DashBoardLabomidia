import React from 'react';
import { useState } from 'react';
import { Mail, Lock } from 'lucide-react';

export function LoginForm({ onSubmit, loading }) {
    const [matricula, setMatricula] = useState('');
    const [senha, setSenha] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!matricula || !senha) {
            alert('Preencha todos os campos');
            return;
        }
        onSubmit(matricula, senha);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            
            <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                    Matrícula
                </label>
                <div className="relative">
                    <Mail className="absolute left-3 top-3 text-slate-500" size={20} />
                    <input
                        type="text"
                        value={matricula}
                        onChange={(e) => setMatricula(e.target.value)}
                        placeholder="Digite sua matrícula"
                        className="w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-red-500 transition"
                        disabled={loading}
                    />
                </div>
            </div>

            
            <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                    Senha
                </label>
                <div className="relative">
                    <Lock className="absolute left-3 top-3 text-slate-500" size={20} />
                    <input
                        type="password"
                        value={senha}
                        onChange={(e) => setSenha(e.target.value)}
                        placeholder="Digite sua senha"
                        className="w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-red-500 transition"
                        disabled={loading}
                    />
                </div>
            </div>

        
            <button
                type="submit"
                disabled={loading}
                className="w-full py-2 bg-linear-to-r from-red-500 to-pink-600 text-white font-medium rounded-lg hover:from-red-600 hover:to-pink-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {loading ? 'Entrando...' : 'Entrar'}
            </button>

            
        </form>
    );
}
