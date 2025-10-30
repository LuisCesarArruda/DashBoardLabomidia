import React from 'react'
import { SystemCard } from './SystemCard';

export function SystemsGrid({ systems, onNavigate }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {systems.map((system) => (
                <SystemCard key={system.id} system={system} onNavigate={onNavigate} />
            ))}
        </div>
    );
}
