import { Printer, Download, FileText, CheckCircle2 } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import type { BienPatrimonial } from '../services/api';

interface Props {
    bien: BienPatrimonial;
    onClose: () => void;
}

export function BienCreadoModal({ bien, onClose }: Props) {
    const handleImprimirTicket = () => {
        window.print();
    };

    const handleDescargar = (formato: 'pdf' | 'word') => {
        window.open(`http://localhost:8080/api/bienes/${bien.numeroInventario}/reporte/${formato}`, '_blank');
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 space-y-6 print:shadow-none print:p-0">

                {/* Encabezado (se oculta al imprimir) */}
                <div className="text-center print:hidden">
                    <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-2" />
                    <h3 className="text-xl font-bold text-slate-800">¡Bien Registrado con Éxito!</h3>
                    <p className="text-sm text-slate-500">Elegí una acción para continuar</p>
                </div>

                {/* --- TICKET IMPRESO (Lo único que sale en la impresora) --- */}
                <div id="ticket-print" className="border-2 border-dashed border-slate-300 p-4 rounded-lg bg-slate-50 print:border-black print:bg-white print:w-[80mm] print:h-[50mm]">
                    <div className="text-center font-bold text-xs uppercase tracking-wider mb-2">
                        Parque Industrial Viedma
                    </div>
                    <div className="flex items-center justify-between gap-2">
                        <div className="space-y-1 text-left text-xs">
                            <p className="font-mono font-bold text-sm">{bien.numeroInventario}</p>
                            <p className="font-semibold text-slate-700 truncate max-w-[150px]">{bien.descripcion}</p>
                            <p className="text-slate-500">Marca: {bien.marca || 'N/A'}</p>
                            <p className="text-[10px] text-slate-400">Pat: {bien.codigoPatrimonial || '-'}</p>
                        </div>
                        {/* Genera un QR con el ID del inventario */}
                        <QRCodeSVG value={bien.numeroInventario} size={64} />
                    </div>
                </div>

                {/* Botones de Acción (Se ocultan al imprimir) */}
                <div className="space-y-3 print:hidden">
                    <button
                        onClick={handleImprimirTicket}
                        className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-900 text-white py-2.5 rounded-lg text-sm font-medium transition-colors"
                    >
                        <Printer className="w-4 h-4" /> Imprimir Etiqueta / Ticket
                    </button>

                    <div className="grid grid-cols-2 gap-3">
                        <button
                            onClick={() => handleDescargar('pdf')}
                            className="flex items-center justify-center gap-2 border border-slate-300 hover:bg-slate-50 text-slate-700 py-2 rounded-lg text-xs font-medium"
                        >
                            <Download className="w-4 h-4 text-red-500" /> Descargar PDF
                        </button>
                        <button
                            onClick={() => handleDescargar('word')}
                            className="flex items-center justify-center gap-2 border border-slate-300 hover:bg-slate-50 text-slate-700 py-2 rounded-lg text-xs font-medium"
                        >
                            <FileText className="w-4 h-4 text-blue-500" /> Descargar Word
                        </button>
                    </div>

                    <button
                        onClick={onClose}
                        className="w-full text-center text-xs text-slate-500 hover:text-slate-700 pt-2"
                    >
                        Cerrar y volver a la lista
                    </button>
                </div>

            </div>
        </div>
    );
}