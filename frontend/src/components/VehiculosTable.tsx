import { useEffect, useState } from 'react';
import { VehiculosService, type Vehiculo } from '../services/api';
import { Car, Search } from 'lucide-react';

export function VehiculosTable() {
    const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('');

    useEffect(() => {
        cargarVehiculos();
    }, []);

    const cargarVehiculos = async () => {
        try {
            setLoading(true);
            const data = await VehiculosService.getAll();
            setVehiculos(data || []);
        } catch (error) {
            console.error("Error cargando vehículos:", error);
        } finally {
            setLoading(false);
        }
    };

    const vehiculosFiltrados = vehiculos.filter(v =>
        v.dominio.toLowerCase().includes(filter.toLowerCase()) ||
        (v.marca && v.marca.toLowerCase().includes(filter.toLowerCase()))
    );

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Flota de Vehículos</h1>
                    <p className="text-sm text-slate-500">Gestión e inventario de unidades de transporte</p>
                </div>
            </div>

            {/* Buscador */}
            <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                    type="text"
                    placeholder="Buscar por patente o marca..."
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-sm w-72 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            {/* Tabla */}
            <div className="bg-white rounded-lg shadow border border-slate-200 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-600 uppercase">
                        <tr>
                            <th className="px-4 py-3">Dominio / Patente</th>
                            <th className="px-4 py-3">Marca / Modelo</th>
                            <th className="px-4 py-3 text-center">Año / Modelo</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 text-sm">
                        {loading ? (
                            <tr>
                                <td colSpan={3} className="px-4 py-8 text-center text-slate-500">
                                    Cargando flota de vehículos...
                                </td>
                            </tr>
                        ) : vehiculosFiltrados.length === 0 ? (
                            <tr>
                                <td colSpan={3} className="px-4 py-8 text-center text-slate-500">
                                    No se encontraron vehículos registrados.
                                </td>
                            </tr>
                        ) : (
                            vehiculosFiltrados.map((v) => (
                                <tr key={v.dominio} className="hover:bg-slate-50">
                                    <td className="px-4 py-3 font-mono font-medium text-slate-800">
                                        <span className="inline-flex items-center gap-2 bg-slate-100 px-2.5 py-1 rounded border border-slate-300">
                                            <Car className="w-4 h-4 text-slate-500" />
                                            {v.dominio}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-slate-700">{v.marca || '-'}</td>
                                    <td className="px-4 py-3 text-center text-slate-600 font-mono">
                                        {v.modeloAnio || '-'}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}