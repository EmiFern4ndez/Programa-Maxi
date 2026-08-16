import { useEffect, useState } from 'react';
import {
    Plus, Search, UserCheck, Edit2, Trash2,
    Building, Package, ChevronDown, ChevronRight, AlertCircle, Hash
} from 'lucide-react';
import { PersonalModal } from './PersonalModal';

import { PersonalService, type Personal } from '../services/api';

export function PersonalTable() {
    const [personalList, setPersonalList] = useState<Personal[]>([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);

    // Estado para filas expandidas usando el CUIL como clave única
    const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});

    // Paginación Local
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    // Modal para Crear / Editar
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [personaAEditar, setPersonaAEditar] = useState<Personal | null>(null);

    useEffect(() => {
        cargarPersonal();
    }, []);

    useEffect(() => {
        setCurrentPage(1);
    }, [search]);

    const cargarPersonal = async () => {
        setLoading(true);
        try {
            const data = await PersonalService.getAll();
            setPersonalList(data || []);
        } catch (error) {
            console.error("Error al cargar personal:", error);
        } finally {
            setLoading(false);
        }
    };

    const toggleRow = (cuil: string) => {
        setExpandedRows(prev => ({
            ...prev,
            [cuil]: !prev[cuil]
        }));
    };

    const handleCrearNuevo = () => {
        setPersonaAEditar(null);
        setIsModalOpen(true);
    };

    const handleEditar = (persona: Personal) => {
        setPersonaAEditar(persona);
        setIsModalOpen(true);
    };

    const handleEliminar = async (cuil: string) => {
        if (!cuil) return;
        if (confirm(`¿Estás seguro de eliminar al personal con CUIL ${cuil}?`)) {
            try {
                await PersonalService.delete(cuil);
                cargarPersonal();
            } catch (error) {
                console.error("Error al eliminar:", error);
            }
        }
    };

    // Filtrado adaptado a cuil, nombreApellido y codigoPrograma
    const personalFiltrado = personalList.filter((p) => {
        const term = search.toLowerCase();
        const nombreCompleto = (p.nombreApellido || '').toLowerCase();
        const cuil = (p.cuil || '').toLowerCase();
        const programa = (p.codigoPrograma || '').toLowerCase();

        return (
            nombreCompleto.includes(term) ||
            cuil.includes(term) ||
            programa.includes(term)
        );
    });

    // Paginación
    const totalPages = Math.ceil(personalFiltrado.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const personalPaginado = personalFiltrado.slice(indexOfFirstItem, indexOfLastItem);

    return (
        <div className="p-8 space-y-6">
            {/* Encabezado */}
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">Personal / Depositarios</h2>
                    <p className="text-slate-500 text-sm">Gestión del personal responsable del patrimonio</p>
                </div>
                <button
                    onClick={handleCrearNuevo}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg flex items-center gap-2 font-medium transition-colors shadow-sm"
                >
                    <Plus className="w-4 h-4" />
                    Nuevo Depositario
                </button>
            </div>

            {/* Búsqueda y Contador */}
            <div className="flex justify-between items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-slate-200">
                <div className="relative flex-1 max-w-md">
                    <Search className="w-4 h-4 absolute left-3 top-3.5 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Buscar por CUIL, nombre y apellido o programa..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div className="text-sm font-semibold text-slate-600 flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-blue-600" />
                    Total: {personalFiltrado.length}
                </div>
            </div>

            {/* Tabla Principal */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center text-slate-500">Cargando personal...</div>
                ) : (
                    <div>
                        <table className="w-full text-left text-sm">
                            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                                <tr>
                                    <th className="p-4 w-10"></th>
                                    <th className="p-4">CUIL</th>
                                    <th className="p-4">Nombre y Apellido</th>
                                    <th className="p-4">Programa</th>
                                    <th className="p-4 text-center">Categoría</th>
                                    <th className="p-4 text-center">Bienes a Cargo</th>
                                    <th className="p-4 text-center">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {personalPaginado.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="p-8 text-center text-slate-400">
                                            No se encontraron registros
                                        </td>
                                    </tr>
                                ) : (
                                    personalPaginado.map((p) => {
                                        const cantidadBienes = p.bienesACargo?.length || 0;
                                        const estaExpandido = !!expandedRows[p.cuil];

                                        return (
                                            <tr key={p.cuil} className="hover:bg-slate-50/50 transition-colors">
                                                {/* Contenido principal en fragmento React para desplegar fila suplementaria */}
                                                <td className="p-4 text-center" colSpan={7}>
                                                    <div className="grid grid-cols-12 items-center text-left">
                                                        <div className="col-span-1 text-center">
                                                            {cantidadBienes > 0 && (
                                                                <button
                                                                    onClick={() => toggleRow(p.cuil)}
                                                                    className="p-1 text-slate-400 hover:text-slate-600 rounded-md hover:bg-slate-100"
                                                                >
                                                                    {estaExpandido ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                                                                </button>
                                                            )}
                                                        </div>

                                                        <div className="col-span-2 font-mono font-medium text-blue-600">
                                                            {p.cuil}
                                                        </div>

                                                        <div className="col-span-3 font-medium text-slate-800">
                                                            {p.nombreApellido}
                                                        </div>

                                                        <div className="col-span-2 flex items-center gap-1.5 text-slate-700 font-medium">
                                                            <Building className="w-3.5 h-3.5 text-slate-400" />
                                                            {p.codigoPrograma || 'Sin Programa'}
                                                        </div>

                                                        <div className="col-span-1 text-center font-mono text-xs text-slate-600">
                                                            {p.categoria ? (
                                                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-100">
                                                                    <Hash className="w-3 h-3 text-slate-400" />
                                                                    {p.categoria}
                                                                </span>
                                                            ) : '-'}
                                                        </div>

                                                        <div className="col-span-2 text-center">
                                                            {cantidadBienes > 0 ? (
                                                                <button
                                                                    onClick={() => toggleRow(p.cuil)}
                                                                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
                                                                >
                                                                    <Package className="w-3.5 h-3.5 text-blue-600" />
                                                                    {cantidadBienes} {cantidadBienes === 1 ? 'bien' : 'bienes'}
                                                                </button>
                                                            ) : (
                                                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-500">
                                                                    <AlertCircle className="w-3.5 h-3.5 text-slate-400" />
                                                                    Sin bienes
                                                                </span>
                                                            )}
                                                        </div>

                                                        <div className="col-span-1 flex justify-center gap-2">
                                                            <button
                                                                onClick={() => handleEditar(p)}
                                                                className="p-1.5 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors"
                                                                title="Editar"
                                                            >
                                                                <Edit2 className="w-4 h-4" />
                                                            </button>
                                                            <button
                                                                onClick={() => handleEliminar(p.cuil)}
                                                                className="p-1.5 hover:bg-red-50 text-red-600 rounded-lg transition-colors"
                                                                title="Eliminar"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    </div>

                                                    {/* Desplegable de Bienes */}
                                                    {estaExpandido && cantidadBienes > 0 && (
                                                        <div className="mt-4 pt-4 border-t border-slate-200 text-left">
                                                            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-3">
                                                                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                                                                    <Package className="w-4 h-4 text-blue-600" />
                                                                    Bienes Asignados a {p.nombreApellido}:
                                                                </h4>
                                                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                                                    {p.bienesACargo?.map((bien) => (
                                                                        <div
                                                                            key={bien.numeroInventario}
                                                                            className="p-3 bg-white rounded-lg border border-slate-200 flex flex-col justify-between"
                                                                        >
                                                                            <div>
                                                                                <div className="font-mono text-xs font-bold text-blue-600">
                                                                                    Inv. N° {bien.numeroInventario}
                                                                                </div>
                                                                                <div className="text-xs font-medium text-slate-800 line-clamp-2 mt-1">
                                                                                    {bien.descripcion}
                                                                                </div>
                                                                            </div>
                                                                            <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2 pt-2 border-t border-slate-100">
                                                                                <span>Marca: {bien.marca || 'S/N'}</span>
                                                                                {bien.estado && (
                                                                                    <span className="font-semibold text-slate-600">
                                                                                        {bien.estado}
                                                                                    </span>
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>

                        {/* Paginación */}
                        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4 text-sm text-slate-600">
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
                                    <option value={10}>10</option>
                                    <option value={20}>20</option>
                                    <option value={50}>50</option>
                                </select>
                            </div>

                            <div className="font-medium text-slate-700">
                                Mostrando {personalFiltrado.length > 0 ? indexOfFirstItem + 1 : 0} - {Math.min(indexOfLastItem, personalFiltrado.length)} de {personalFiltrado.length}
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
                                    {currentPage} / {totalPages || 1}
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
                    </div>
                )}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <PersonalModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSuccess={cargarPersonal}
                    personaAEditar={personaAEditar}
                />
            )}
        </div>
    );
}