import React from 'react';
import { Film, Package, Calendar, DoorOpen, Users } from 'lucide-react';

export function SystemIcon({ system, size = 48 }) {
    // Se tem imagem, mostra a imagem
    if (system.image) {
        return (
            <div className={`w-16 h-16 p-2 rounded-lg overflow-hidden bg-gradient-to-br ${system.color}`}>
                <img
                    src={system.image}
                    alt={system.title}
                    className="w-full h-full object-cover"
                />
            </div>
        );
    }

    // Senão, mostra o ícone do lucide-react
    const iconMap = {
        acervo: Film,
        aluguel: Package,
        calendario: Calendar,
        salas: DoorOpen,
        banco: Users,
    };

    const Icon = iconMap[system.id] || Film;

    return (
        <div className={`inline-flex p-1.5 rounded-lg bg-gradient-to-br ${system.color} text-white`}>
            <Icon size={size} />
        </div>
    );
}