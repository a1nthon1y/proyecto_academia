'use client';

import { Suspense } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { FormCrearMatricula } from '@/components/matriculas/FormCrearMatricula';
import { ListaMatriculas } from '@/components/matriculas/ListaMatriculas';
import { FormEditarMatricula } from '@/components/matriculas/FormEditarMatricula';
import { usePageMode } from '@/hooks/usePageMode';
import { PageHeader } from '@/components/shared/PageHeader';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { useQueryClient } from '@tanstack/react-query';
import { Plus, ClipboardList } from 'lucide-react';

/**
 * Página para gestionar matrículas (TRABAJADOR/ADMIN)
 * Usa URL search params para que el back del navegador funcione
 * naturalmente entre lista, crear y editar.
 */
export default function TrabajadorMatriculasPage() {
  return (
    <Suspense fallback={<div className="p-12 flex justify-center"><LoadingSpinner /></div>}>
      <MatriculasPageContent />
    </Suspense>
  );
}

function MatriculasPageContent() {
  const { mode, id: editingId, openCreate, openEdit, backToList } = usePageMode();
  const queryClient = useQueryClient();

  const handleEditSuccess = () => {
    backToList();
    queryClient.invalidateQueries({ queryKey: ['matriculas'] });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <PageHeader
          title="Matrículas"
          subtitle={
            mode === 'crear'
              ? 'Registrar una nueva matrícula'
              : mode === 'editar' && editingId
                ? `Matrícula #${editingId}`
                : 'Gestión de matrículas de alumnos en los programas de tutoría'
          }
          mode={mode}
          onBack={backToList}
          actions={
            <button
              onClick={openCreate}
              className="flex items-center gap-2 rounded-lg bg-navy-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-navy-700 transition"
            >
              <Plus className="h-4 w-4" />
              Nueva matrícula
            </button>
          }
        />

        {mode === 'crear' && (
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-6">
            <div className="flex items-center gap-2 pb-3 mb-4 border-b border-slate-100">
              <ClipboardList className="h-5 w-5 text-navy-600" />
              <h2 className="text-base font-semibold text-navy-900">
                Crear nueva matrícula
              </h2>
            </div>
            <FormCrearMatricula
              onSuccess={() => {
                backToList();
                queryClient.invalidateQueries({ queryKey: ['matriculas'] });
              }}
            />
          </div>
        )}

        {mode === 'editar' && editingId && (
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

        {mode === 'lista' && (
          <ListaMatriculas onEdit={openEdit} />
        )}
      </div>
    </DashboardLayout>
  );
}
