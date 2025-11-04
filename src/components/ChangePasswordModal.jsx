import React, { useState } from 'react';
import { X, KeyRound } from 'lucide-react';
import { changePassword } from '../services/authService.js';

export default function ChangePasswordModal({ onClose }) {
    const [matricula, setMatricula] = useState('');
    const [senhaAtual, setSenhaAtual] = useState('');
    const [novaSenha, setNovaSenha] = useState('');
    const [mensagem, setMensagem] = useState('');
    const [loading, setLoading] = useState(false);
    const [sucesso, setSucesso] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMensagem('');
        setSucesso(false);

        try {
            setLoading(true);
            const res = await changePassword(matricula, senhaAtual, novaSenha);
            setMensagem(res.mensagem);
            setSucesso(true);
        } catch (error) {
            setMensagem(error.message || 'Erro ao alterar senha');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
            <div className="bg-slate-800 rounded-2xl p-6 w-full max-w-md border border-slate-700 shadow-2xl relative">
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-slate-400 hover:text-white"
                >
                    <X size={22} />
                </button>

                <div className="flex flex-col items-center mb-4">
                    <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mb-3">
                        <KeyRound className="text-red-500" size={30} />
                    </div>
                    <h2 className="text-xl font-bold text-white">Alterar Senha</h2>
                    <p className="text-slate-400 text-sm mt-1">Informe seus dados abaixo</p>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                    <input
                        type="text"
                        placeholder="Matrícula"
                        value={matricula}
                        onChange={(e) => setMatricula(e.target.value)}
                        className="p-2 rounded-lg bg-slate-700 text-white border border-slate-600 placeholder-slate-400"
                    />
                    <input
                        type="password"
                        placeholder="Senha atual"
                        value={senhaAtual}
                        onChange={(e) => setSenhaAtual(e.target.value)}
                        className="p-2 rounded-lg bg-slate-700 text-white border border-slate-600 placeholder-slate-400"
                    />
                    <input
                        type="password"
                        placeholder="Nova senha"
                        value={novaSenha}
                        onChange={(e) => setNovaSenha(e.target.value)}
                        className="p-2 rounded-lg bg-slate-700 text-white border border-slate-600 placeholder-slate-400"
                    />

                    {mensagem && (
                        <p
                            className={`text-sm mt-1 text-center ${sucesso ? 'text-green-400' : 'text-red-400'
                                }`}
                        >
                            {mensagem}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="mt-3 w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg font-medium transition-all disabled:opacity-50"
                    >
                        {loading ? 'Alterando...' : 'Alterar Senha'}
                    </button>
                </form>
            </div>
        </div>
    );
}
