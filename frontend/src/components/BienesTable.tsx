import {useEffect, useState} from 'react';
import {BienesService, type BienPatrimonial} from '../services/api';
import {BienModal} from './BienModal';
import {Edit2, PackageCheck, Plus, Search, Trash2} from 'lucide-react';

export function BienesTable() {
    const [bienes, setBienes] = useState<BienPatrimonial[]>([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);

    // Estados de Paginación
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(20);

    // Estados del Modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [bienAEditar, setBienAEditar] = useState<BienPatrimonial | null>(null);

    useEffect(() => {
        cargarBienes();
    }, []);

    // Resetea a la página 1 cuando el usuario busca algo
    useEffect(() => {
        setCurrentPage(1);
    }, [search]);

    const cargarBienes = () => {
        setLoading(true);
        BienesService.getAll()
            .then(data => {
                setBienes(data || []);
            })
            .catch(err => console.error("Error cargando bienes:", err))
            .finally(() => setLoading(false));
    };

    const handleCrearNuevo = () => {
        setBienAEditar(null);
        setIsModalOpen(true);
    };

    const handleEditar = (bien: BienPatrimonial) => {
        setBienAEditar(bien);
        setIsModalOpen(true);
    };

    const handleEliminar = async (inventario: string) => {
        if (confirm(`¿Estás seguro de eliminar el bien N° ${inventario}?`)) {
            await BienesService.delete(inventario);
            cargarBienes();
        }
    };

    // 1. Filtrado total
    const bienesFiltrados = bienes.filter((b) => {
        const term = search.toLowerCase();
        const descripcion = (b.descripcion || '').toLowerCase();
        const inventario = (b.numeroInventario || '').toLowerCase();
        const marca = (b.marca || '').toLowerCase();

        return (
            descripcion.includes(term) ||
            inventario.includes(term) ||
            marca.includes(term)
        );
    });

    // 2. Paginación
    const totalPages = Math.ceil(bienesFiltrados.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;

    // IMPORTANTE: Este es el subarray recortado que DEBE recorrer la tabla (máximo 20/50/100 elementos)
    const bienesPaginados = bienesFiltrados.slice(indexOfFirstItem, indexOfLastItem);

    // Componente reutilizable para los botones de control de páginas
    const Paginador = () => (
        <div className="flex flex-wrap items-center justify-between gap-4 text-sm text-slate-600 w-full">
            <div className="flex items-center gap-2">
                <span>Mostrar:</span>
                <select
                    value={itemsPerPage}
                    onChange={(e) => {
                        setItemsPerPage(Number(e.target.value));
                        setCurrentPage(1);
                    }}
                    className="bg-white border border-slate-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value={10}>10 por pág.</option>
                    <option value={20}>20 por pág.</option>
                    <option value={50}>50 por pág.</option>
                    <option value={100}>100 por pág.</option>
                </select>
            </div>

            <div className="font-medium text-slate-700">
                Mostrando {bienesFiltrados.length > 0 ? indexOfFirstItem + 1 : 0} - {Math.min(indexOfLastItem, bienesFiltrados.length)} de {bienesFiltrados.length}
            </div>

            <div className="flex items-center gap-2">
                <button
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white font-medium text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                    &larr; Anterior
                </button>
                <span className="px-2 font-semibold text-slate-800">
                    Pág. {currentPage} de {totalPages || 1}
                </span>
                <button
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage >= totalPages || totalPages === 0}
                    className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white font-medium text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                    Siguiente &rarr;
                </button>
            </div>
        </div>
    );

    return (
        <div className="p-8 space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">Bienes Patrimoniales</h2>
                    <p className="text-slate-500 text-sm">Control e inventario general de activos</p>
                </div>
                <button
                    onClick={handleCrearNuevo}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg flex items-center gap-2 font-medium transition-colors"
                >
                    <Plus className="w-4 h-4"/>
                    Nuevo Bien
                </button>
            </div>

            <div
                className="flex justify-between items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-slate-200">
                <div className="relative flex-1 max-w-md">
                    <Search className="w-4 h-4 absolute left-3 top-3.5 text-slate-400"/>
                    <input
                        type="text"
                        placeholder="Buscar por N° inventario, descripción o marca..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div className="text-sm font-semibold text-slate-600 flex items-center gap-2">
                    <PackageCheck className="w-4 h-4 text-blue-600"/>
                    Total: {bienesFiltrados.length}
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center text-slate-500">Cargando bienes...</div>
                ) : (
                    <div>
                        {/* BARRA SUPERIOR DE PAGINACIÓN */}
                        <div className="p-4 bg-slate-50 border-b border-slate-200">
                            <Paginador/>
                        </div>

                        <table className="w-full text-left text-sm">
                            <thead className="bg-slate-100 border-b border-slate-200 text-slate-600 font-semibold">
                            <tr>
                                <th className="p-4">N° Inventario</th>
                                <th className="p-4">Descripción</th>
                                <th className="p-4">Marca</th>
                                <th className="p-4">Estado</th>
                                <th className="p-4 text-right">Importe Total</th>
                                <th className="p-4 text-center">Acciones</th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                            {/* ATENCIÓN AQUÍ: Se mapea bienesPaginados en lugar de bienesFiltrados */}
                            {bienesPaginados.map((b) => (
                                <tr key={b.numeroInventario} className="hover:bg-slate-50/50">
                                    <td className="p-4 font-mono font-medium text-blue-600">{b.numeroInventario}</td>
                                    <td className="p-4 font-medium text-slate-800">{b.descripcion}</td>
                                    <td className="p-4 text-slate-500">{b.marca || '-'}</td>
                                    <td className="p-4">
                                        <span
                                            className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                                                b.estado === 'BUENO'
                                                    ? 'bg-emerald-100 text-emerald-700'
                                                    : b.estado === 'REGULAR'
                                                        ? 'bg-amber-100 text-amber-700'
                                                        : 'bg-slate-100 text-slate-700'
                                            }`}
                                        >
                                          {b.estado}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right font-medium text-slate-700">
                                        ${b.importeTotal ? b.importeTotal.toLocaleString() : '0'}
                                    </td>
                                    <td className="p-4">
                                        <div className="flex justify-center gap-2">
                                            <button
                                                onClick={() => handleEditar(b)}
                                                className="p-1.5 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors"
                                            >
                                                <Edit2 className="w-4 h-4"/>
                                            </button>
                                            <button
                                                onClick={() => handleEliminar(b.numeroInventario)}
                                                className="p-1.5 hover:bg-red-50 text-red-600 rounded-lg transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4"/>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>

                        {/* BARRA INFERIOR DE PAGINACIÓN */}
                        <div className="p-4 bg-slate-50 border-t border-slate-200">
                            <Paginador/>
                        </div>
                    </div>
                )}
            </div>

            {/* Componente Modal */}
            <BienModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={cargarBienes}
                bienAEditar={bienAEditar}
            />
        </div>
    );
}