'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { FormCrearTutor } from '@/components/tutores/FormCrearTutor';
import { FormEditarTutor } from '@/components/tutores/FormEditarTutor';
import { useQuery } from '@tanstack/react-query';
import { listarTutores } from '@/services/tutoresServiceTrabajador';
import { useEliminarTutor } from '@/hooks/useTutoresMutations';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { User, Plus, MapPin, Phone, Mail, CheckCircle, XCircle, Pencil, Trash2 } from 'lucide-react';
import Swal from 'sweetalert2';

export default function TrabajadorTutoresPage() {
  const [view, setView] = useState('list'); // 'list', 'create', 'edit'
  const [selectedTutor, setSelectedTutor] = useState(null);

  const { data: tutores, isLoading, refetch } = useQuery({
    queryKey: ['tutores', 'trabajador'],
    queryFn: listarTutores,
  });

  const eliminarMutation = useEliminarTutor();

  const handleEdit = (tutor) => {
    setSelectedTutor(tutor);
    setView('edit');
  };

  const handleDelete = async (tutor) => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: `Se eliminará al tutor ${tutor.nombres} ${tutor.apellidos}. Esta acción no se puede deshacer.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      eliminarMutation.mutate(tutor.id);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-navy-900">Tutores</h1>
            <p className="text-sm text-slate-600">Gestión de personal docente</p>
          </div>
          {view === 'list' && (
            <button
              onClick={() => setView('create')}
              className="flex items-center gap-2 rounded-lg bg-navy-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-navy-700 transition"
            >
              <Plus className="h-4 w-4" />
              Nuevo Tutor
            </button>
          )}
          {(view === 'create' || view === 'edit') && (
            <button
              onClick={() => {
                setView('list');
                setSelectedTutor(null);
              }}
              className="text-sm text-navy-600 hover:text-navy-800 hover:underline transition font-medium"
            >
              &larr; Volver a la lista
            </button>
          )}
        </div>

        {view === 'create' ? (
          <FormCrearTutor onSuccess={() => {
            refetch();
            setView('list');
          }} />
        ) : view === 'edit' && selectedTutor ? (
          <FormEditarTutor
            tutor={selectedTutor}
            onSuccess={() => {
              refetch();
              setView('list');
              setSelectedTutor(null);
            }}
            onCancel={() => {
              setView('list');
              setSelectedTutor(null);
            }}
          />
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            {isLoading ? (
              <div className="p-8 flex justify-center">
                <LoadingSpinner />
              </div>
            ) : !tutores || tutores.length === 0 ? (
              <div className="p-12 text-center text-slate-500">
                <User className="h-12 w-12 mx-auto text-slate-300 mb-3" />
                <p>No hay tutores registrados.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-4">Tutor</th>
                      <th className="px-6 py-4">Contacto</th>
                      <th className="px-6 py-4">Ubicación</th>
                      <th className="px-6 py-4">Estado</th>
                      <th className="px-6 py-4 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {tutores.map((tutor) => (
                      <tr key={tutor.id} className="hover:bg-slate-50 transition">
                        <td className="px-6 py-4">
                          <div className="font-medium text-navy-900">
                            {tutor.apellidos}, {tutor.nombres}
                          </div>
                          <div className="text-xs text-slate-500">
                            {tutor.especialidad || 'Sin especialidad'}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 text-slate-600">
                            <Mail className="h-3 w-3" />
                            {tutor.email}
                          </div>
                          <div className="flex items-center gap-2 text-slate-600 mt-1">
                            <Phone className="h-3 w-3" />
                            {tutor.telefono || '-'}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1 text-slate-600">
                            <MapPin className="h-3 w-3 text-gold-500" />
                            {tutor.ciudad || '-'}{tutor.distrito ? `, ${tutor.distrito}` : ''}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {tutor.activo ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
                              <CheckCircle className="h-3 w-3" /> Activo
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
                              <XCircle className="h-3 w-3" /> Inactivo
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleEdit(tutor)}
                              className="p-1.5 text-slate-500 hover:bg-slate-100 hover:text-navy-600 rounded-lg transition"
                              title="Editar"
                            >
                              <Pencil className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(tutor)}
                              className="p-1.5 text-slate-500 hover:bg-red-50 hover:text-red-600 rounded-lg transition"
                              title="Eliminar"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
