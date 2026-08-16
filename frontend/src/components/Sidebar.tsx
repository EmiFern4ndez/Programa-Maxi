import {Package, ShieldCheck, Truck, Users} from 'lucide-react';

interface SidebarProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
}

export function Sidebar({activeTab, setActiveTab}: SidebarProps) {
    const menuItems = [
        {id: 'bienes', label: 'Bienes Patrimoniales', icon: Package},
        {id: 'personal', label: 'Personal / Depositarios', icon: Users},
        {id: 'vehiculos', label: 'Flota de Vehículos', icon: Truck},
    ];

    return (
        <aside
            className="w-64 bg-slate-900 text-white min-h-screen p-4 flex flex-col justify-between border-r border-slate-800">
            <div>
                <div className="flex items-center gap-3 px-2 py-4 mb-6 border-b border-slate-800">
                    <ShieldCheck className="w-8 h-8 text-blue-400"/>
                    <div>
                        <h1 className="font-bold text-base leading-tight">SisMax</h1>
                        <span className="text-xs text-slate-400">Gestión Patrimonial</span>
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
                                <Icon className="w-5 h-5"/>
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