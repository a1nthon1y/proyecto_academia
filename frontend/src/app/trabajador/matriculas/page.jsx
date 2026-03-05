'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { FormCrearMatricula } from '@/components/matriculas/FormCrearMatricula';
import { ListaMatriculas } from '@/components/matriculas/ListaMatriculas';
import { FormEditarMatricula } from '@/components/matriculas/FormEditarMatricula';
import { useQueryClient } from '@tanstack/react-query';

/**
 * Página para gestionar matrículas (TRABAJADOR/ADMIN)
 * Ruta: /trabajador/matriculas
 */
export default function TrabajadorMatriculasPage() {
  const [editingId, setEditingId] = useState(null);
  const queryClient = useQueryClient();

  const handleEditSuccess = () => {
    setEditingId(null);
    queryClient.invalidateQueries({ queryKey: ['matriculas'] });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Matrículas
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Gestiona las matrículas de alumnos en los distintos programas de tutoría.
          </p>
        </div>

        {editingId ? (
          <div>
            <h2 className="text-lg font-semibold text-slate-900 mb-3">
              Editar Matrícula #{editingId}
            </h2>
            <FormEditarMatricula
              matriculaId={editingId}
              onSuccess={handleEditSuccess}
              onCancel={() => setEditingId(null)}
            />
          </div>
        ) : (
          <div>
            <h2 className="text-lg font-semibold text-slate-900 mb-3">
              Crear nueva matrícula
            </h2>
            <FormCrearMatricula />
          </div>
        )}

        <div>
          <h2 className="text-lg font-semibold text-slate-900 mb-3">
            Lista de matrículas
          </h2>
          <ListaMatriculas onEdit={setEditingId} />
        </div>
      </div>
    </DashboardLayout>
  );
}