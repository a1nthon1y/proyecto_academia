'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useMisHijos } from '@/hooks/usePadres';
import { ListaAsistencias } from '@/components/asistencia/ListaAsistencias';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { ExclamationCircleIcon } from '@heroicons/react/24/outline';

/**
 * Página para que el PADRE (rol_id = 3) vea asistencias de tutores
 * Ruta: /padre/asistencias
 */
export default function PadreAsistenciasPage() {
  const { hijos, isLoading } = useMisHijos();

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Asistencias de tutores
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Consulta el historial de asistencias registradas por los tutores de tus hijos.
          </p>
        </div>

        {hijos.length === 0 ? (
          <div className="rounded-xl bg-yellow-50 border border-yellow-200 p-4">
            <div className="flex items-start gap-3">
              <ExclamationCircleIcon className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-yellow-800">
                  No tienes hijos registrados
                </p>
                <p className="mt-1 text-xs text-yellow-700">
                  Contacta con la administración para registrar a tus hijos en el sistema.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Lista de asistencias recientes */}
            <div className="max-w-4xl">
              <h2 className="text-lg font-semibold text-slate-900 mb-3">
                Historial de Asistencias
              </h2>
              <ListaAsistencias />
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
