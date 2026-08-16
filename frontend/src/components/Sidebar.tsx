import { Package, Truck, Users } from 'lucide-react';

interface SidebarProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
}

// Componente Isotipo SisMax (Escudo + Métricas)
function SisMaxLogoIcon({ className = "w-9 h-9" }: { className?: string }) {
    return (
        <svg
            className={className}
            viewBox="0 0 90 90"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <defs>
                <linearGradient id="sm-slate" x1="0%" y1="100%" x2="0%" y2="0%">
                    <stop offset="0%" stopColor="#475569" />
                    <stop offset="100%" stopColor="#64748B" />
                </linearGradient>
                <linearGradient id="sm-blue" x1="0%" y1="100%" x2="0%" y2="0%">
                    <stop offset="0%" stopColor="#2563EB" />
                    <stop offset="100%" stopColor="#3B82F6" />
                </linearGradient>
                <linearGradient id="sm-emerald" x1="0%" y1="100%" x2="0%" y2="0%">
                    <stop offset="0%" stopColor="#059669" />
                    <stop offset="100%" stopColor="#10B981" />
                </linearGradient>
            </defs>

            <rect x="0" y="0" width="90" height="90" rx="22" fill="#0F172A" stroke="#1E293B" strokeWidth="2" />
            <rect x="20" y="46" width="12" height="30" rx="3.5" fill="url(#sm-slate)" />
            <rect x="39" y="34" width="12" height="42" rx="3.5" fill="url(#sm-blue)" />
            <rect x="58" y="20" width="12" height="56" rx="3.5" fill="url(#sm-emerald)" />
            <path
                d="M 16 38 L 34 54 L 74 16"
                fill="none"
                stroke="#38BDF8"
                strokeWidth="4.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

export function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
    const menuItems = [
        { id: 'bienes', label: 'Bienes Patrimoniales', icon: Package },
        { id: 'personal', label: 'Personal / Depositarios', icon: Users },
        { id: 'vehiculos', label: 'Flota de Vehículos', icon: Truck },
    ];

    return (
        <aside className="w-64 bg-slate-900 text-white h-full p-4 flex flex-col justify-between border-r border-slate-800 shrink-0 select-none">
            <div>
                {/* Header del Sidebar con el nuevo Isotipo SVG */}
                <div className="flex items-center gap-3 px-2 py-4 mb-6 border-b border-slate-800">
                    <SisMaxLogoIcon className="w-9 h-9 shrink-0" />
                    <div>
                        <h1 className="font-extrabold text-lg leading-none tracking-tight text-slate-100">
                            Sis<span className="text-sky-400">Max</span>
                        </h1>
                        <span className="text-[11px] font-medium text-slate-400 tracking-wider uppercase block mt-1">
                            Gestión Patrimonial
                        </span>
                    </div>
                </div>

                <nav className="space-y-1">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = activeTab === item.id;
                        return (
                            <button
                                key={item.id}
                                onClick={() => setActiveTab(item.id)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                                    isActive
                                        ? 'bg-blue-600 text-white'
                                        : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                                }`}
                            >
                                <Icon className="w-5 h-5" />
                                {item.label}
                            </button>
                        );
                    })}
                </nav>
            </div>

            <div className="text-xs text-slate-500 px-2 py-4 border-t border-slate-800">
                Sistema Patrimonial v1.0
            </div>
        </aside>
    );
}