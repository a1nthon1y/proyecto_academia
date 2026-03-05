'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { FormCrearAlumno } from '@/components/alumnos/FormCrearAlumno';
import { FormEditarAlumno } from '@/components/alumnos/FormEditarAlumno';
import { useQuery } from '@tanstack/react-query';
import { listarAlumnos } from '@/services/alumnosService';
import { useEliminarAlumno } from '@/hooks/useAlumnosMutations';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { User, Plus, CheckCircle, XCircle, Pencil, Trash2, Calendar, MapPin, GraduationCap } from 'lucide-react';
import Swal from 'sweetalert2';

export default function TrabajadorAlumnosPage() {
  const [view, setView] = useState('list'); // 'list', 'create', 'edit'
  const [selectedAlumno, setSelectedAlumno] = useState(null);

  const { data: alumnos, isLoading, refetch } = useQuery({
    queryKey: ['alumnos'],
    queryFn: listarAlumnos,
  });

  const eliminarMutation = useEliminarAlumno();

  const handleEdit = (alumno) => {
    setSelectedAlumno(alumno);
    setView('edit');
  };

  const handleDelete = async (alumno) => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: `Se eliminará al alumno ${alumno.nombres} ${alumno.apellidos}.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      eliminarMutation.mutate(alumno.id);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-navy-900">Alumnos</h1>
            <p className="text-sm text-slate-600">Gestión de estudiantes</p>
          </div>
          {view === 'list' && (
            <button
              onClick={() => setView('create')}
              className="flex items-center gap-2 rounded-lg bg-navy-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-navy-700 transition"
            >
              <Plus className="h-4 w-4" />
              Nuevo Alumno
            </button>
          )}
          {(view === 'create' || view === 'edit') && (
            <button
              onClick={() => {
                setView('list');
                setSelectedAlumno(null);
              }}
              className="text-sm text-navy-600 hover:text-navy-800 hover:underline transition font-medium"
            >
              &larr; Volver a la lista
            </button>
          )}
        </div>

        {view === 'create' ? (
          <FormCrearAlumno onSuccess={() => {
            refetch();
            setView('list');
          }} />
        ) : view === 'edit' && selectedAlumno ? (
          <FormEditarAlumno
            alumno={selectedAlumno}
            onSuccess={() => {
              refetch();
              setView('list');
              setSelectedAlumno(null);
            }}
            onCancel={() => {
              setView('list');
              setSelectedAlumno(null);
            }}
          />
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            {isLoading ? (
              <div className="p-8 flex justify-center">
                <LoadingSpinner />
              </div>
            ) : !alumnos || alumnos.length === 0 ? (
              <div className="p-12 text-center text-slate-500">
                <User className="h-12 w-12 mx-auto text-slate-300 mb-3" />
                <p>No hay alumnos registrados.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-4">Estudiante</th>
                      <th className="px-6 py-4">Detalles</th>
                      <th className="px-6 py-4">Apoderado</th>
                      <th className="px-6 py-4">Ubicación</th>
                      <th className="px-6 py-4 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {alumnos.map((alumno) => (
                      <tr key={alumno.id} className="hover:bg-slate-50 transition">
                        <td className="px-6 py-4">
                          <div className="font-medium text-navy-900">
                            {alumno.apellidos}, {alumno.nombres}
                          </div>
                          <div className="text-xs text-slate-500">
                            DNI: {alumno.dni}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 text-slate-600">
                            <GraduationCap className="h-3 w-3" />
                            {alumno.grado || 'Sin grado'}
                          </div>
                          <div className="flex items-center gap-2 text-slate-600 mt-1">
                            <Calendar className="h-3 w-3" />
                            {alumno.fecha_nacimiento ? new Date(alumno.fecha_nacimiento).toLocaleDateString() : '-'}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-slate-700 font-medium">
                            {alumno.padre}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1 text-slate-600">
                            <MapPin className="h-3 w-3 text-gold-500" />
                            {alumno.ciudad || '-'}{alumno.distrito ? `, ${alumno.distrito}` : ''}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleEdit(alumno)}
                              className="p-1.5 text-slate-500 hover:bg-slate-100 hover:text-navy-600 rounded-lg transition"
                              title="Editar"
                            >
                              <Pencil className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(alumno)}
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
