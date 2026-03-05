'use client';

import { useAlumnos } from '@/hooks/useAlumnos';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { DataTable } from '@/components/tables/DataTable';

/**
 * Componente que muestra la lista de alumnos
 */
export function ListaAlumnos() {
  const { alumnos, isLoading } = useAlumnos();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <LoadingSpinner />
      </div>
    );
  }

  if (alumnos.length === 0) {
    return (
      <div className="rounded-xl bg-slate-50 border border-slate-200 p-4 text-center">
        <p className="text-sm text-slate-600">
          No hay alumnos registrados aún.
        </p>
      </div>
    );
  }

  const columns = [
    {
      key: 'nombres',
      header: 'Nombres',
      render: (row) => `${row.nombres} ${row.apellidos}`,
    },
    {
      key: 'fecha_nacimiento',
      header: 'Fecha de nacimiento',
      render: (row) =>
        row.fecha_nacimiento
          ? new Date(row.fecha_nacimiento).toLocaleDateString('es-ES')
          : '-',
    },
    {
      key: 'padre',
      header: 'Padre',
    },
  ];

  return <DataTable columns={columns} data={alumnos} isLoading={isLoading} />;
}
