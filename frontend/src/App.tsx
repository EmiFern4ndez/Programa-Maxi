import {useState} from 'react';
import {Sidebar} from './components/Sidebar';
import {BienesTable} from './components/BienesTable';

export function App() {
    const [activeTab, setActiveTab] = useState('bienes');

    return (
        <div className="flex min-h-screen bg-slate-100">
            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab}/>
            <main className="flex-1">
                {activeTab === 'bienes' && <BienesTable/>}
                {activeTab === 'personal' &&
                    <div className="p-8 text-slate-600 font-semibold">Módulo de Personal en desarrollo...</div>}
                {activeTab === 'vehiculos' &&
                    <div className="p-8 text-slate-600 font-semibold">Módulo de Vehículos en desarrollo...</div>}
            </main>
        </div>
    );
}

export default App;