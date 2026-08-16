import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { PersonalService, OpcionesService, type Personal } from '../services/api';
import type { Programa, Categoria } from '../types/Opciones';

interface PersonalModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    personaAEditar: Personal | null;
}

export function PersonalModal({ isOpen, onClose, onSuccess, personaAEditar }: PersonalModalProps) {
    const [formData, setFormData] = useState<Personal>({
        cuil: '',
        nombreApellido: '',
        codigoPrograma: '',
        categoria: undefined,
    });

    // Soporta arreglos de objetos (Programa/Categoria) o de valores simples (string/number)
    const [programas, setProgramas] = useState<(Programa | string)[]>([]);
    const [categorias, setCategorias] = useState<(Categoria | number)[]>([]);
    const [loadingOpciones, setLoadingOpciones] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (isOpen) {
            cargarOpciones();
            if (personaAEditar) {
                setFormData(personaAEditar);
            } else {
                setFormData({
                    cuil: '',
                    nombreApellido: '',
                    codigoPrograma: '',
                    categoria: undefined,
                });
            }
        }
    }, [isOpen, personaAEditar]);

    const cargarOpciones = async () => {
        try {
            setLoadingOpciones(true);
            const [progsData, catsData] = await Promise.all([
                OpcionesService.getProgramas(),
                OpcionesService.getCategorias()
            ]);
            setProgramas(progsData || []);
            setCategorias(catsData || []);
        } catch (error) {
            console.error("Error al cargar programas y categorías:", error);
        } finally {
            setLoadingOpciones(false);
        }
    };

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            if (personaAEditar) {
                await PersonalService.update(formData.cuil, formData);
            } else {
                await PersonalService.create(formData);
            }
            onSuccess();
            onClose();
        } catch (error) {
            console.error("Error al guardar personal:", error);
            alert("Ocurrió un error al guardar los datos.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-lg p-6 space-y-6">
                <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                    <h3 className="text-lg font-bold text-slate-800">
                        {personaAEditar ? 'Editar Depositario' : 'Nuevo Depositario'}
                    </h3>
                    <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">CUIL *</label>
                        <input
                            type="text"
                            required
                            disabled={!!personaAEditar}
                            placeholder="Ej: 20-12345678-9"
                            value={formData.cuil}
                            onChange={(e) => setFormData({ ...formData, cuil: e.target.value })}
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">Nombre y Apellido *</label>
                        <input
                            type="text"
                            required
                            placeholder="Ej: Juan Pérez"
                            value={formData.nombreApellido}
                            onChange={(e) => setFormData({ ...formData, nombreApellido: e.target.value })}
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {/* Selector dinámico de Código de Programa */}
                        <div>
                            <label className="block text-xs font-semibold text-slate-600 mb-1">Código de Programa</label>
                            <select
                                value={formData.codigoPrograma || ''}
                                onChange={(e) => setFormData({ ...formData, codigoPrograma: e.target.value })}
                                disabled={loadingOpciones}
                                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white disabled:bg-slate-100"
                            >
                                <option value="">Seleccionar programa...</option>
                                {programas.map((prog) => {
                                    const val = typeof prog === 'string' ? prog : prog.codigo;
                                    const label = typeof prog === 'string' ? prog : `${prog.codigo}${prog.nombre ? ` - ${prog.nombre}` : ''}`;
                                    return (
                                        <option key={val} value={val}>
                                            {label}
                                        </option>
                                    );
                                })}
                            </select>
                        </div>

                        {/* Selector dinámico de Categoría */}
                        <div>
                            <label className="block text-xs font-semibold text-slate-600 mb-1">Categoría</label>
                            <select
                                value={formData.categoria ?? ''}
                                onChange={(e) => setFormData({ ...formData, categoria: e.target.value ? Number(e.target.value) : undefined })}
                                disabled={loadingOpciones}
                                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white disabled:bg-slate-100"
                            >
                                <option value="">Seleccionar categoría...</option>
                                {categorias.map((cat) => {
                                    const val = typeof cat === 'number' ? cat : cat.numero;
                                    const label = typeof cat === 'number' ? `Categoría ${cat}` : `Categoría ${cat.numero}${cat.descripcion ? ` - ${cat.descripcion}` : ''}`;
                                    return (
                                        <option key={val} value={val}>
                                            {label}
                                        </option>
                                    );
                                })}
                            </select>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={submitting || loadingOpciones}
                            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50"
                        >
                            {submitting ? 'Guardando...' : 'Guardar'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}