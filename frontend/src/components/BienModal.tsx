import {useEffect, useState} from 'react';
import {BienesService, type BienPatrimonial} from '../services/api';
import {X} from 'lucide-react';

interface BienModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    bienAEditar?: BienPatrimonial | null;
}

export function BienModal({isOpen, onClose, onSuccess, bienAEditar}: BienModalProps) {
    const [formData, setFormData] = useState<Partial<BienPatrimonial>>({
        numeroInventario: '',
        descripcion: '',
        marca: '',
        estado: 'BUENO',
        importeTotal: 0,
        cantidad: 1,
    });

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (bienAEditar) {
            setFormData(bienAEditar);
        } else {
            setFormData({
                numeroInventario: '',
                descripcion: '',
                marca: '',
                estado: 'BUENO',
                importeTotal: 0,
                cantidad: 1,
            });
        }
    }, [bienAEditar, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (bienAEditar) {
                // Petición PUT (Edición)
                await BienesService.update(formData.numeroInventario!, formData as BienPatrimonial);
            } else {
                // Petición POST (Alta)
                await BienesService.create(formData as BienPatrimonial);
            }
            onSuccess();
            onClose();
        } catch (error) {
            console.error('Error al guardar el bien:', error);
            alert('Ocurrió un error al guardar los datos en el servidor.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden border border-slate-200">
                <div className="flex justify-between items-center p-6 border-b border-slate-100">
                    <h3 className="text-lg font-bold text-slate-800">
                        {bienAEditar ? 'Editar Bien Patrimonial' : 'Registrar Nuevo Bien'}
                    </h3>
                    <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg">
                        <X className="w-5 h-5"/>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">N°
                            Inventario</label>
                        <input
                            type="text"
                            required
                            disabled={!!bienAEditar}
                            value={formData.numeroInventario || ''}
                            onChange={(e) => setFormData({...formData, numeroInventario: e.target.value})}
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-slate-100"
                            placeholder="Ej: INV-2026-001"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Descripción</label>
                        <textarea
                            required
                            rows={2}
                            value={formData.descripcion || ''}
                            onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="Descripción detallada del bien..."
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Marca</label>
                            <input
                                type="text"
                                value={formData.marca || ''}
                                onChange={(e) => setFormData({...formData, marca: e.target.value})}
                                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="Ej: Dell, HP, Samsung"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Estado</label>
                            <select
                                value={formData.estado || 'BUENO'}
                                onChange={(e) => setFormData({...formData, estado: e.target.value})}
                                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                            >
                                <option value="BUENO">BUENO</option>
                                <option value="REGULAR">REGULAR</option>
                                <option value="MALO">MALO</option>
                                <option value="EN REPARACION">EN REPARACION</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label
                                className="block text-xs font-semibold text-slate-600 uppercase mb-1">Cantidad</label>
                            <input
                                type="number"
                                min="1"
                                value={formData.cantidad || 1}
                                onChange={(e) => setFormData({...formData, cantidad: Number(e.target.value)})}
                                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Importe Total
                                ($)</label>
                            <input
                                type="number"
                                step="0.01"
                                value={formData.importeTotal || 0}
                                onChange={(e) => setFormData({...formData, importeTotal: Number(e.target.value)})}
                                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                            />
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
                            disabled={loading}
                            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50"
                        >
                            {loading ? 'Guardando...' : bienAEditar ? 'Actualizar' : 'Crear Bien'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}