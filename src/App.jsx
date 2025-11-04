import React from 'react';
import { useState, useEffect } from 'react';
import { getLoggedUser, logout } from './services/authService';
import Login from './pages/Login';
import LaboDashboard from './pages/LaboDashboard';
import { Header } from './components/Header';
import './global.css';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verifica se há usuário logado ao carregar
    const loggedUser = getLoggedUser();
    if (loggedUser) {
      setUser(loggedUser);
    }
    setLoading(false);
  }, []);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    logout();
    setUser(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <p className="text-slate-400">Carregando...</p>
      </div>
    );
  }

  // Se não está logado, mostra tela de login
  if (!user) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className='min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-900'>
      <Header user={user} onLogout={handleLogout} />
      <LaboDashboard />
    </div>
  );
}

export default App;