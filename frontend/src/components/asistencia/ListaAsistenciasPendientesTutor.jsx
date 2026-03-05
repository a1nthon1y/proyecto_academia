'use client';

import { LoadingSpinner } from '@/components/LoadingSpinner';
import { ClockIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

/**
 * Componente que muestra la lista de asistencias pendientes del tutor
 * NOTA: El endpoint /api/tutores/mis-asistencias aún no existe en el backend
 * Por ahora muestra un mensaje informativo
 */
export function ListaAsistenciasPendientesTutor({ asistencias = [], isLoading = false }) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <LoadingSpinner />
      </div>
    );
  }

  // Filtrar solo asistencias pendientes (confirmado_padre = true, confirmado_tutor = false)
  const asistenciasPendientes = asistencias.filter(
    (asistencia) => asistencia.confirmado_padre && !asistencia.confirmado_tutor
  );

  if (asistencias.length === 0) {
    return (
      <div className="rounded-xl bg-slate-50 border border-slate-200 p-4 text-center">
        <p className="text-sm text-slate-600">
          No hay asistencias disponibles aún. El endpoint del backend se está implementando.
        </p>
      </div>
    );
  }

  if (asistenciasPendientes.length === 0) {
    return (
      <div className="rounded-xl bg-green-50 border border-green-200 p-4 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <CheckCircleIcon className="h-5 w-5 text-green-600" />
          <p className="text-sm font-medium text-green-800">
            No hay asistencias pendientes
          </p>
        </div>
        <p className="text-xs text-green-700">
          Todas las asistencias han sido confirmadas.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {asistenciasPendientes.map((asistencia) => (
        <div
          key={asistencia.id}
          className="rounded-lg bg-white border border-yellow-200 p-3 flex items-center justify-between"
        >
          <div className="flex-1">
            <p className="text-sm font-medium text-slate-900">
              {asistencia.alumno || 'Alumno'} - {asistencia.padre || 'Padre'}
            </p>
            <p className="text-xs text-slate-500 mt-1">
              {new Date(asistencia.fecha).toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
              {asistencia.hora_confirmacion_padre &&
                ` • Marcada por padre: ${asistencia.hora_confirmacion_padre}`}
            </p>
          </div>
          <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-700">
            <ClockIcon className="h-3 w-3" />
            Pendiente
          </span>
        </div>
      ))}
    </div>
  );
}
