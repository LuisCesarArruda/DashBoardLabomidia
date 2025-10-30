import React from 'react'
import { Film, Package, Calendar, DoorOpen, Users } from 'lucide-react';
import { Header } from '../components/Header';
import { SystemsGrid } from '../components/SystemGrid';
import { WelcomeSection } from '../components/WelcomeSection'
import { InfoSection } from '../components/InfoSection'

export default function LaboDashboard() {
    const systems = [
        {
            id: 'acervo',
            title: 'Acervo de Filmes',
            description: 'Consulte e gerencie o acervo de filmes do laboratório',
            icon: Film,
            color: 'from-blue-500 to-blue-600',
            url: 'https://acervo-cinema-unifor.vercel.app/',
            status: 'ativo'
        },
        {
            id: 'banco-talento',
            title: 'Banco de Talento',
            description: 'Gerencie e consulte o banco de talentos do laboratório',
            icon: Users,
            color: 'from-pink-500 to-pink-600',
            url: 'https://banco-talento-labo.vercel.app/',
            status: 'ativo'
        },
        {
            id: 'aluguel',
            title: 'Aluguel de Dispositivos',
            description: 'Faça requisição e acompanhe o aluguel de equipamentos',
            icon: Package,
            color: 'from-purple-500 to-purple-600',
            url: 'https://seu-aluguel-dispositivos.vercel.app',
            status: 'em desenvolvimento'
        },
        {
            id: 'calendario',
            title: 'Calendário de Aulas',
            description: 'Visualize todas as aulas agendadas durante o ano',
            icon: Calendar,
            color: 'from-green-500 to-green-600',
            url: 'https://seu-calendario-aulas.vercel.app',
            status: 'em desenvolvimento'
        },
        {
            id: 'salas',
            title: 'Solicitação de Salas',
            description: 'Solicite o uso de salas do laboratório',
            icon: DoorOpen,
            color: 'from-orange-500 to-orange-600',
            url: 'https://seu-solicitacao-salas.vercel.app',
            status: 'em desenvolvimento'
        },

    ];

    const handleNavigate = (url, status) => {
        if (status === 'em desenvolvimento') {
            alert('Este sistema ainda está em desenvolvimento. Em breve estará disponível!');
            return;
        }
        window.open(url, '_blank');
    };

    return (
        <div className="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-900">
            <Header />
            <main className="max-w-7xl mx-auto px-6 py-12">
                <WelcomeSection />
                <SystemsGrid systems={systems} onNavigate={handleNavigate} />
                <InfoSection />
            </main>
        </div>
    );
}