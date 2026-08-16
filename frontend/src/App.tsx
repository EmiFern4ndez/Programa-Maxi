import {useState} from 'react';
import {Sidebar} from './components/Sidebar';
import {BienesTable} from './components/BienesTable';
import { PersonalTable } from './components/PersonalTable';
import { VehiculosTable } from './components/VehiculosTable';

export function App() {
    const [activeTab, setActiveTab] = useState('bienes');

    return (
        <div className="flex min-h-screen bg-slate-100">
            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab}/>
            <main className="flex-1">
                {activeTab === 'bienes' && <BienesTable/>}
                {activeTab === 'personal' && <PersonalTable/>}
                {activeTab === 'vehiculos' && <VehiculosTable />}
            </main>
        </div>
    );
}

export default App;