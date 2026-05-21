'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { FormCrearMatricula } from '@/components/matriculas/FormCrearMatricula';
import { ListaMatriculas } from '@/components/matriculas/ListaMatriculas';
import { FormEditarMatricula } from '@/components/matriculas/FormEditarMatricula';
import { useQueryClient } from '@tanstack/react-query';
import { Plus, ClipboardList } from 'lucide-react';

/**
 * Página para gestionar matrículas (TRABAJADOR/ADMIN)
 * Ruta: /trabajador/matriculas
 *
 * Sigue el mismo patrón visual y de navegación que /trabajador/alumnos,
 * /trabajador/padres y /trabajador/tutores: vista 'list' por defecto,
 * con header consistente y botón "← Volver" en vistas de formulario.
 */
export default function TrabajadorMatriculasPage() {
  const [view, setView] = useState('list'); // 'list' | 'create' | 'edit'
  const [editingId, setEditingId] = useState(null);
  const queryClient = useQueryClient();

  const handleEditSuccess = () => {
    setEditingId(null);
    setView('list');
    queryClient.invalidateQueries({ queryKey: ['matriculas'] });
  };

  const handleEditClick = (id) => {
    setEditingId(id);
    setView('edit');
  };

  const backToList = () => {
    setEditingId(null);
    setView('list');
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-navy-900">Matrículas</h1>
            <p className="text-sm text-slate-600">
              Gestión de matrículas de alumnos en los programas de tutoría
            </p>
          </div>
          {view === 'list' && (
            <button
              onClick={() => setView('create')}
              className="flex items-center gap-2 rounded-lg bg-navy-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-navy-700 transition"
            >
              <Plus className="h-4 w-4" />
              Nueva matrícula
            </button>
          )}
          {view !== 'list' && (
            <button
              onClick={backToList}
              className="text-sm text-navy-600 hover:text-navy-800 hover:underline transition font-medium"
            >
              &larr; Volver a la lista
            </button>
          )}
        </div>

        {view === 'create' && (
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-6">
            <div className="flex items-center gap-2 pb-3 mb-4 border-b border-slate-100">
              <ClipboardList className="h-5 w-5 text-navy-600" />
              <h2 className="text-base font-semibold text-navy-900">
                Crear nueva matrícula
              </h2>
            </div>
            <FormCrearMatricula
              onSuccess={() => {
                setView('list');
                queryClient.invalidateQueries({ queryKey: ['matriculas'] });
              }}
            />
          </div>
        )}

        {view === 'edit' && editingId && (
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-6">
            <div className="flex items-center gap-2 pb-3 mb-4 border-b border-slate-100">
              <ClipboardList className="h-5 w-5 text-navy-600" />
              <h2 className="text-base font-semibold text-navy-900">
                Editar matrícula <span className="text-slate-500 font-normal">#{editingId}</span>
              </h2>
            </div>
            <FormEditarMatricula
              matriculaId={editingId}
              onSuccess={handleEditSuccess}
              onCancel={backToList}
            />
          </div>
        )}

        {view === 'list' && (
          <ListaMatriculas onEdit={handleEditClick} />
        )}
      </div>
    </DashboardLayout>
  );
}
