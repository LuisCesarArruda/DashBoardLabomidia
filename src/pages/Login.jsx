import React from 'react';
import { useState } from 'react';
import { loginUser } from '../services/authService.js';
import { LoginForm } from '../components/LoginForm.jsx';
import { RegisterForm } from '../components/RegisterForm.jsx';
import { Header } from "../components/Header.jsx"
import ChangePasswordModal from '../components/ChangePasswordModal.jsx';
import { Lock } from 'lucide-react';


export default function Login({ onLoginSuccess }) {
    const [isRegister, setIsRegister] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showChangePassword, setShowChangePassword] = useState(false);


    const handleLogin = async (matricula, senha) => {
        try {
            setLoading(true);
            setError('');
            const user = await loginUser(matricula, senha);
            onLoginSuccess(user);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <Header />
                <div className="text-center mb-8 p-2">
                    <div className="flex justify-center mb-4">
                        <div className="w-16 h-16 rounded-lg bg-linear-to-br from-red-500 to-pink-600 flex items-center justify-center">
                            <Lock className="text-white" size={32} />
                        </div>
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">Plataforma Labomidia</h1>
                    <p className="text-slate-400">Cinema Unifor</p>
                </div>

                <div className="bg-slate-800 rounded-xl border border-slate-700 p-8 shadow-xl">

                    {error && (
                        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg">
                            <p className="text-red-300 text-sm">❌ {error}</p>
                        </div>
                    )}




                    {!isRegister ? (
                        <LoginForm onSubmit={handleLogin} loading={loading} />
                    ) : (
                        <RegisterForm onToggleLogin={() => setIsRegister(false)} />
                    )}
                    {!isRegister && (
                        <div className="text-center mt-4 ">
                            <button
                                onClick={() => setShowChangePassword(true)}
                                className="text-slate-400 text-sm hover:text-slate-200 cursor-pointer underline"
                            >
                                Esqueceu ou deseja alterar a senha?
                            </button>
                        </div>
                    )}
                    <div className="flex gap-2 mb-6 p-2">
                        <button
                            onClick={() => setIsRegister(false)}
                            className={`flex-1 py-2 rounded-lg font-medium transition-all ${!isRegister
                                ? 'bg-red-500 text-white cursor-pointer'
                                : 'bg-slate-700 text-slate-300 hover:bg-slate-600 cursor-pointer'
                                }`}
                        >
                            Login
                        </button>
                        <button
                            onClick={() => setIsRegister(true)}
                            className={`flex-1 py-2 rounded-lg font-medium transition-all ${isRegister
                                ? 'bg-red-500 text-white cursor-pointer'
                                : 'bg-slate-700 text-slate-300 hover:bg-slate-600 cursor-pointer'
                                }`}
                        >
                            Registrar
                        </button>
                    </div>
                </div>
                {showChangePassword && (
                    <ChangePasswordModal onClose={() => setShowChangePassword(false)} />
                )}
                <div className="text-center mt-6 text-slate-400 text-sm">
                    <p>Plataforma do Labomidia - Unifor</p>
                </div>
            </div>
        </div>
    );
}