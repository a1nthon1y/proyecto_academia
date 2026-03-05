'use client';

import { useMisAsistencias } from '@/hooks/usePadres';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { CheckCircleIcon, ClockIcon } from '@heroicons/react/24/outline';

/**
 * Componente que muestra la lista de asistencias del padre autenticado
 * Consume: GET /api/padres/asistencias
 */
export function ListaAsistencias() {
  const { asistencias, isLoading } = useMisAsistencias();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <LoadingSpinner />
      </div>
    );
  }

  if (asistencias.length === 0) {
    return (
      <div className="rounded-xl bg-slate-50 border border-slate-200 p-4 text-center">
        <p className="text-sm text-slate-600">
          No hay asistencias registradas aún.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {asistencias.slice(0, 10).map((asistencia) => {
        // Determinar estado basado en confirmado_tutor y confirmado_padre
        const estado =
          asistencia.confirmado_tutor && asistencia.confirmado_padre
            ? 'COMPLETA'
            : asistencia.confirmado_padre
            ? 'PENDIENTE_TUTOR'
            : 'PENDIENTE';

        const estadoConfig = {
          COMPLETA: {
            label: 'Completa',
            bgColor: 'bg-green-100',
            textColor: 'text-green-700',
            icon: CheckCircleIcon,
          },
          PENDIENTE_TUTOR: {
            label: 'Pendiente tutor',
            bgColor: 'bg-yellow-100',
            textColor: 'text-yellow-700',
            icon: ClockIcon,
          },
          PENDIENTE: {
            label: 'Pendiente',
            bgColor: 'bg-slate-100',
            textColor: 'text-slate-700',
            icon: ClockIcon,
          },
        };

        const config = estadoConfig[estado];
        const IconComponent = config.icon;

        return (
          <div
            key={asistencia.id}
            className="rounded-lg bg-white border border-slate-200 p-3 flex items-center justify-between"
          >
            <div className="flex-1">
              <p className="text-sm font-medium text-slate-900">
                {asistencia.tutor} - {asistencia.alumno}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                {new Date(asistencia.fecha).toLocaleDateString('es-ES', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
                {asistencia.hora_confirmacion_padre &&
                  ` • Confirmado: ${asistencia.hora_confirmacion_padre}`}
                {asistencia.hora_llegada_tutor &&
                  ` • Llegada tutor: ${asistencia.hora_llegada_tutor}`}
              </p>
            </div>
            <span
              className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${config.bgColor} ${config.textColor}`}
            >
              <IconComponent className="h-3 w-3" />
              {config.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
