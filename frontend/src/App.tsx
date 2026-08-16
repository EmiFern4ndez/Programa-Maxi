import { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { BienesTable } from './components/BienesTable';
import { PersonalTable } from './components/PersonalTable';
import { VehiculosTable } from './components/VehiculosTable';

export function App() {
    const [activeTab, setActiveTab] = useState('bienes');

    return (
        <div className="flex h-screen w-screen overflow-hidden bg-slate-100">
            {/* Sidebar fijo */}
            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

            {/* Contenedor principal sin scroll global */}
            <main className="flex-1 h-full overflow-hidden flex flex-col">
                {activeTab === 'bienes' && <BienesTable />}
                {activeTab === 'personal' && <PersonalTable />}
                {activeTab === 'vehiculos' && <VehiculosTable />}
            </main>
        </div>
    );
}

export default App;