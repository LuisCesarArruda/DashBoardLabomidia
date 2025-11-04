import React from 'react';
import { useState } from 'react';
import { registerNewAluno } from '../services/authService';
import { User, Mail, Hash, Check } from 'lucide-react';

export function RegisterForm({ onToggleLogin }) {
    const [nome, setNome] = useState('');
    const [matricula, setMatricula] = useState('');
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [sucesso, setSucesso] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!nome || !matricula || !email) {
            setError('Preencha todos os campos');
            return;
        }

        try {
            setLoading(true);
            setError('');
            await registerNewAluno(nome, matricula, email);
            setSucesso(true);

            setTimeout(() => {
                setSucesso(false);
                onToggleLogin();
            }, 5000);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (sucesso) {
        return (
            <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check className="text-green-400" size={32} />
                </div>
                <h3 className="text-green-400 font-bold mb-2">Solicitação Enviada!</h3>
                <p className="text-slate-400 text-sm mb-4">
                    Verifique seu email. O laboratório validará sua matrícula em breve.
                </p>
                <p className="text-slate-500 text-xs">
                    Redirecionando para login...
                </p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            
            {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/50 rounded-lg">
                    <p className="text-red-300 text-sm">❌ {error}</p>
                </div>
            )}

            
            <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                    Nome Completo
                </label>
                <div className="relative">
                    <User className="absolute left-3 top-3 text-slate-500" size={20} />
                    <input
                        type="text"
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                        placeholder="Seu nome completo"
                        className="w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-red-500 transition"
                        disabled={loading}
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                    Matrícula
                </label>
                <div className="relative">
                    <Hash className="absolute left-3 top-3 text-slate-500" size={20} />
                    <input
                        type="text"
                        value={matricula}
                        onChange={(e) => setMatricula(e.target.value)}
                        placeholder="Sua matrícula"
                        className="w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-red-500 transition"
                        disabled={loading}
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                    Email Unifor
                </label>
                <div className="relative">
                    <Mail className="absolute left-3 top-3 text-slate-500" size={20} />
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="seu.email@edu.unifor.br"
                        className="w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-red-500 transition"
                        disabled={loading}
                    />
                </div>
            </div>

            <div className="p-3 bg-blue-500/10 border border-blue-500/50 rounded-lg">
                <p className="text-blue-300 text-xs">
                    ℹ️ Aguarde a validação da sua matricula.
                </p>
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full py-2 bg-linear-to-r from-red-500 to-pink-600 text-white font-medium rounded-lg hover:from-red-600 hover:to-pink-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {loading ? 'Enviando...' : 'Solicitar Acesso'}
            </button>
        </form>
    );
}