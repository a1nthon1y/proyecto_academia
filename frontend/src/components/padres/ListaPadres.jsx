'use client';

import { usePadres } from '@/hooks/usePadresTrabajador';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { DataTable } from '@/components/tables/DataTable';

/**
 * Componente que muestra la lista de padres de familia
 */
export function ListaPadres() {
  const { padres, isLoading } = usePadres();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <LoadingSpinner />
      </div>
    );
  }

  if (padres.length === 0) {
    return (
      <div className="rounded-xl bg-slate-50 border border-slate-200 p-4 text-center">
        <p className="text-sm text-slate-600">
          No hay padres registrados aún.
        </p>
      </div>
    );
  }

  const columns = [
    {
      key: 'email',
      header: 'Email',
    },
    {
      key: 'rol',
      header: 'Rol',
    },
    {
      key: 'activo',
      header: 'Estado',
      render: (row) => (
        <span
          className={`px-2 py-1 text-xs font-medium rounded-full ${
            row.activo
              ? 'bg-green-100 text-green-700'
              : 'bg-red-100 text-red-700'
          }`}
        >
          {row.activo ? 'Activo' : 'Inactivo'}
        </span>
      ),
    },
  ];

  return <DataTable columns={columns} data={padres} isLoading={isLoading} />;
}
