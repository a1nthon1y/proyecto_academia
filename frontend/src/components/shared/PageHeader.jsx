'use client';

import { ArrowLeft } from 'lucide-react';

/**
 * Encabezado de página estándar.
 * Cuando estás en una vista de detalle/form muestra un botón "Volver" prominente.
 *
 * Props:
 *   - title: string (siempre)
 *   - subtitle?: string
 *   - mode?: 'lista' | 'crear' | 'editar'
 *   - onBack?: () => void   (si está presente y mode !== 'lista' muestra botón Volver)
 *   - actions?: ReactNode   (se muestra a la derecha cuando mode === 'lista')
 */
export function PageHeader({ title, subtitle, mode = 'lista', onBack, actions }) {
    const isFormView = mode !== 'lista' && typeof onBack === 'function';

    // Etiquetas dinámicas según el modo
    const formLabel =
        mode === 'crear' ? 'Nuevo registro' : mode === 'editar' ? 'Editando' : null;

    return (
        <div className="space-y-3">
            {isFormView && (
                <button
                    type="button"
                    onClick={onBack}
                    className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 shadow-sm transition hover:border-navy-300 hover:bg-navy-50 hover:text-navy-700"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Volver a la lista
                </button>
            )}

            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div className="min-w-0">
                    {formLabel && (
                        <p className="text-xs font-semibold uppercase tracking-wider text-navy-600">
                            {formLabel}
                        </p>
                    )}
                    <h1 className="text-xl sm:text-2xl font-bold text-navy-900 truncate">{title}</h1>
                    {subtitle && (
                        <p className="mt-0.5 text-sm text-slate-600 line-clamp-2">{subtitle}</p>
                    )}
                </div>
                {!isFormView && actions ? (
                    <div className="[&>button]:w-full sm:[&>button]:w-auto">{actions}</div>
                ) : null}
            </div>
        </div>
    );
}
