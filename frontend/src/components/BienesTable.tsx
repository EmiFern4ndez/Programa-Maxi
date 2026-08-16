import { useEffect, useState } from 'react';
import { BienesService, type BienPatrimonial } from '../services/api';
import { BienModal } from './BienModal';
import { Edit2, PackageCheck, Plus, Search, Trash2 } from 'lucide-react';

export function BienesTable() {
    const [bienes, setBienes] = useState<BienPatrimonial[]>([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);

    // Estados de Paginación (Default en 10)
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    // Estados del Modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [bienAEditar, setBienAEditar] = useState<BienPatrimonial | null>(null);

    useEffect(() => {
        cargarBienes();
    }, []);

    useEffect(() => {
        setCurrentPage(1);
    }, [search]);

    const cargarBienes = () => {
        setLoading(true);
        BienesService.getAll()
            .then((data) => {
                setBienes(data || []);
            })
            .catch((err) => console.error("Error cargando bienes:", err))
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
    const bienesPaginados = bienesFiltrados.slice(indexOfFirstItem, indexOfLastItem);

    const Paginador = () => (
        <div className="flex flex-wrap items-center justify-between gap-4 text-xs font-medium text-slate-600 w-full">
            <div className="flex items-center gap-2">
                <span>Mostrar:</span>
                <select
                    value={itemsPerPage}
                    onChange={(e) => {
                        setItemsPerPage(Number(e.target.value));
                        setCurrentPage(1);
                    }}
                    className="bg-white border border-slate-300 rounded-lg px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                    <option value={10}>10 por pág.</option>
                    <option value={20}>20 por pág.</option>
                    <option value={50}>50 por pág.</option>
                    <option value={100}>100 por pág.</option>
                </select>
            </div>

            <div className="text-slate-500">
                Mostrando <span className="font-semibold text-slate-700">{bienesFiltrados.length > 0 ? indexOfFirstItem + 1 : 0}</span> - <span className="font-semibold text-slate-700">{Math.min(indexOfLastItem, bienesFiltrados.length)}</span> de <span className="font-semibold text-slate-700">{bienesFiltrados.length}</span>
            </div>

            <div className="flex items-center gap-2">
                <button
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-xs"
                >
                    &larr; Anterior
                </button>
                <span className="px-2 font-semibold text-slate-800">
                    Pág. {currentPage} de {totalPages || 1}
                </span>
                <button
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage >= totalPages || totalPages === 0}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-xs"
                >
                    Siguiente &rarr;
                </button>
            </div>
        </div>
    );

    return (
        <div className="p-8 space-y-6 max-w-[1600px] mx-auto">
            {/* Header del módulo */}
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Bienes Patrimoniales</h2>
                    <p className="text-slate-500 text-sm">Control e inventario general de activos</p>
                </div>
                <button
                    onClick={handleCrearNuevo}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-lg flex items-center gap-2 font-medium transition-all shadow-sm active:scale-95 cursor-pointer"
                >
                    <Plus className="w-4 h-4" />
                    Nuevo Bien
                </button>
            </div>

            {/* Buscador */}
            <div className="flex justify-between items-center gap-4 bg-white p-4 rounded-xl shadow-xs border border-slate-200/80">
                <div className="relative flex-1 max-w-md">
                    <Search className="w-4 h-4 absolute left-3 top-3.5 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Buscar por N° inventario, descripción o marca..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                    />
                </div>
                <div className="text-sm font-semibold text-slate-600 flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200/60">
                    <PackageCheck className="w-4 h-4 text-indigo-600" />
                    Total: {bienesFiltrados.length}
                </div>
            </div>

            {/* Contenedor de Tabla con Scroll Interno y Header Sticky */}
            <div className="bg-white rounded-xl shadow-xs border border-slate-200/80 overflow-hidden">
                {loading ? (
                    <div className="p-12 text-center text-slate-500 font-medium">Cargando bienes patrimoniales...</div>
                ) : (
                    <div>
                        {/* Se agrega min-h-[520px] para mantener constante la altura de 10 filas */}
                        <div className="max-h-[calc(100vh-340px)] min-h-[520px] overflow-y-auto">
                            <table className="w-full text-left text-sm border-collapse">
                                <thead className="sticky top-0 bg-slate-100/90 backdrop-blur-xs border-b border-slate-200 text-slate-600 font-semibold z-10 shadow-xs">
                                    <tr>
                                        <th className="p-4 uppercase text-[11px] tracking-wider text-slate-500">N° Inventario</th>
                                        <th className="p-4 uppercase text-[11px] tracking-wider text-slate-500">Descripción</th>
                                        <th className="p-4 uppercase text-[11px] tracking-wider text-slate-500">Marca</th>
                                        <th className="p-4 uppercase text-[11px] tracking-wider text-slate-500">Estado</th>
                                        <th className="p-4 uppercase text-[11px] tracking-wider text-slate-500 text-right">Importe Total</th>
                                        <th className="p-4 uppercase text-[11px] tracking-wider text-slate-500 text-center">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 bg-white">
                                    {bienesPaginados.map((b) => (
                                        <tr key={b.numeroInventario} className="h-[52px] hover:bg-slate-50/80 transition-colors">
                                            <td className="p-4 font-mono font-bold text-indigo-600">{b.numeroInventario}</td>
                                            <td className="p-4 font-medium text-slate-800">{b.descripcion}</td>
                                            <td className="p-4 text-slate-500">{b.marca || '-'}</td>
                                            <td className="p-4">
                                                <span
                                                    className={`px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide ${
                                                        b.estado === 'BUENO'
                                                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                                                            : b.estado === 'REGULAR'
                                                            ? 'bg-amber-50 text-amber-700 border border-amber-200/60'
                                                            : 'bg-rose-50 text-rose-700 border border-rose-200/60'
                                                    }`}
                                                >
                                                    {b.estado}
                                                </span>
                                            </td>
                                            <td className="p-4 text-right font-semibold text-slate-700 font-mono">
                                                ${b.importeTotal ? b.importeTotal.toLocaleString() : '0'}
                                            </td>
                                            <td className="p-4">
                                                <div className="flex justify-center gap-1">
                                                    <button
                                                        onClick={() => handleEditar(b)}
                                                        className="p-1.5 hover:bg-indigo-50 text-indigo-600 rounded-lg transition-colors cursor-pointer"
                                                        title="Editar"
                                                    >
                                                        <Edit2 className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleEliminar(b.numeroInventario)}
                                                        className="p-1.5 hover:bg-rose-50 text-rose-600 rounded-lg transition-colors cursor-pointer"
                                                        title="Eliminar"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="p-3.5 bg-slate-50/80 border-t border-slate-200/80">
                            <Paginador />
                        </div>
                    </div>
                )}
            </div>

            <BienModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={cargarBienes}
                bienAEditar={bienAEditar}
            />
        </div>
    );
}