'use client';

import { Suspense, useState, useMemo } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { FormCrearAlumno } from '@/components/alumnos/FormCrearAlumno';
import { FormEditarAlumno } from '@/components/alumnos/FormEditarAlumno';
import { useQuery } from '@tanstack/react-query';
import { listarAlumnos } from '@/services/alumnosService';
import { useEliminarAlumno } from '@/hooks/useAlumnosMutations';
import { usePageMode } from '@/hooks/usePageMode';
import { PageHeader } from '@/components/shared/PageHeader';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import {
  User, Plus, Pencil, Trash2, Calendar, MapPin, GraduationCap,
  Users, Search, UserCheck,
} from 'lucide-react';
import Swal from 'sweetalert2';

export default function TrabajadorAlumnosPage() {
  return (
    <Suspense fallback={<div className="p-12 flex justify-center"><LoadingSpinner /></div>}>
      <AlumnosPageContent />
    </Suspense>
  );
}

function AlumnosPageContent() {
  const { mode, id: editingId, openCreate, openEdit, backToList } = usePageMode();
  const [search, setSearch] = useState('');

  const { data: alumnos, isLoading, refetch } = useQuery({
    queryKey: ['alumnos'],
    queryFn: listarAlumnos,
  });

  const selectedAlumno = useMemo(
    () => (alumnos || []).find((a) => a.id === editingId) || null,
    [alumnos, editingId]
  );

  const eliminarMutation = useEliminarAlumno();

  const filtrados = useMemo(() => {
    const list = alumnos || [];
    if (!search.trim()) return list;
    const s = search.trim().toLowerCase();
    return list.filter((a) =>
      `${a.nombres || ''} ${a.apellidos || ''}`.toLowerCase().includes(s) ||
      (a.dni || '').toLowerCase().includes(s) ||
      (a.padre || '').toLowerCase().includes(s) ||
      (a.grado || '').toLowerCase().includes(s)
    );
  }, [alumnos, search]);

  const stats = useMemo(() => {
    const list = alumnos || [];
    return {
      total: list.length,
      conPadre: list.filter((a) => a.padre).length,
      ciudades: new Set(list.map((a) => a.ciudad).filter(Boolean)).size,
    };
  }, [alumnos]);

  const handleEdit = (alumno) => {
    openEdit(alumno.id);
  };

  const handleDelete = async (alumno) => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: `Se eliminará al alumno ${alumno.nombres} ${alumno.apellidos}.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    });
    if (result.isConfirmed) eliminarMutation.mutate(alumno.id);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <PageHeader
          title="Alumnos"
          subtitle={
            mode === 'crear'
              ? 'Registrar un nuevo estudiante'
              : mode === 'editar' && selectedAlumno
                ? `${selectedAlumno.nombres} ${selectedAlumno.apellidos}`
                : 'Gestión de estudiantes inscritos'
          }
          mode={mode}
          onBack={backToList}
          actions={
            <button
              onClick={openCreate}
              className="flex items-center gap-2 rounded-lg bg-navy-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-navy-700 transition"
            >
              <Plus className="h-4 w-4" />
              Nuevo alumno
            </button>
          }
        />

        {mode === 'lista' && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Total alumnos</p>
              <p className="mt-1 text-2xl font-bold text-navy-900">{stats.total}</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Con apoderado</p>
              <p className="mt-1 text-2xl font-bold text-emerald-700">{stats.conPadre}</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Ciudades</p>
              <p className="mt-1 text-2xl font-bold text-blue-700">{stats.ciudades}</p>
            </div>
          </div>
        )}

        {mode === 'crear' ? (
          <FormCrearAlumno onSuccess={() => { refetch(); backToList(); }} />
        ) : mode === 'editar' && selectedAlumno ? (
          <FormEditarAlumno
            alumno={selectedAlumno}
            onSuccess={() => { refetch(); backToList(); }}
            onCancel={backToList}
          />
        ) : mode === 'editar' && !selectedAlumno ? (
          <div className="rounded-xl bg-white p-12 text-center shadow-sm ring-1 ring-slate-200">
            <p className="text-sm text-slate-500">Alumno no encontrado.</p>
            <button onClick={backToList} className="mt-3 text-sm font-medium text-navy-600 hover:underline">
              Volver a la lista
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-slate-500" />
                <span className="text-sm font-medium text-slate-700">
                  {filtrados.length} de {stats.total} alumnos
                </span>
              </div>
              <div className="relative w-full sm:w-auto">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                <input
                  type="search"
                  placeholder="Buscar por nombre, DNI, padre…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full sm:w-72 pl-8 pr-3 py-1.5 text-sm rounded-lg border border-slate-300 focus:border-navy-500 focus:ring-2 focus:ring-navy-100 outline-none"
                />
              </div>
            </div>

            {isLoading ? (
              <div className="p-12 flex justify-center">
                <LoadingSpinner />
              </div>
            ) : filtrados.length === 0 ? (
              <div className="p-12 text-center text-slate-500">
                <GraduationCap className="h-12 w-12 mx-auto text-slate-300 mb-3" />
                <p className="text-sm">
                  {stats.total === 0
                    ? 'No hay alumnos registrados aún.'
                    : 'No se encontraron alumnos con esa búsqueda.'}
                </p>
              </div>
            ) : (
              <>
                {/* Vista MÓVIL: cards apiladas */}
                <ul className="md:hidden divide-y divide-slate-100">
                  {filtrados.map((alumno) => (
                    <li key={alumno.id} className="p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <div className="font-semibold text-navy-900 truncate">
                            {alumno.apellidos}, {alumno.nombres}
                          </div>
                          <div className="text-xs text-slate-500">DNI: {alumno.dni}</div>
                        </div>
                        {alumno.grado && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700 flex-shrink-0">
                            {alumno.grado}
                          </span>
                        )}
                      </div>
                      <div className="mt-3 space-y-1 text-sm text-slate-600">
                        {alumno.padre && (
                          <div className="flex items-center gap-2 truncate">
                            <UserCheck className="h-3.5 w-3.5 flex-shrink-0 text-slate-400" />
                            <span className="truncate">{alumno.padre}</span>
                          </div>
                        )}
                        {alumno.fecha_nacimiento && (
                          <div className="flex items-center gap-2 text-xs">
                            <Calendar className="h-3.5 w-3.5 flex-shrink-0 text-slate-400" />
                            {new Date(alumno.fecha_nacimiento).toLocaleDateString('es-PE')}
                          </div>
                        )}
                        {(alumno.ciudad || alumno.distrito) && (
                          <div className="flex items-center gap-2 text-xs">
                            <MapPin className="h-3.5 w-3.5 flex-shrink-0 text-gold-500" />
                            {alumno.ciudad}{alumno.distrito ? `, ${alumno.distrito}` : ''}
                          </div>
                        )}
                      </div>
                      <div className="mt-3 flex items-center gap-2 border-t border-slate-100 pt-3">
                        <button
                          onClick={() => handleEdit(alumno)}
                          className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                        >
                          <Pencil className="h-4 w-4" />
                          Editar
                        </button>
                        <button
                          onClick={() => handleDelete(alumno)}
                          className="flex items-center justify-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-100"
                          aria-label="Eliminar"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>

                {/* Vista DESKTOP/TABLET: tabla */}
                <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-3">Estudiante</th>
                      <th className="px-4 py-3">Detalles</th>
                      <th className="px-4 py-3 hidden lg:table-cell">Apoderado</th>
                      <th className="px-4 py-3 hidden lg:table-cell">Ubicación</th>
                      <th className="px-4 py-3 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filtrados.map((alumno) => (
                      <tr key={alumno.id} className="hover:bg-slate-50 transition">
                        <td className="px-4 py-3">
                          <div className="font-medium text-navy-900">
                            {alumno.apellidos}, {alumno.nombres}
                          </div>
                          <div className="text-xs text-slate-500">
                            DNI: {alumno.dni}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2 text-slate-600">
                            <GraduationCap className="h-3 w-3" />
                            {alumno.grado || 'Sin grado'}
                          </div>
                          <div className="flex items-center gap-2 text-slate-600 mt-1">
                            <Calendar className="h-3 w-3" />
                            {alumno.fecha_nacimiento
                              ? new Date(alumno.fecha_nacimiento).toLocaleDateString('es-PE')
                              : '-'}
                          </div>
                        </td>
                        <td className="px-4 py-3 hidden lg:table-cell">
                          <div className="text-slate-700 font-medium flex items-center gap-1">
                            <UserCheck className="h-3 w-3 text-slate-400" />
                            {alumno.padre || '-'}
                          </div>
                        </td>
                        <td className="px-4 py-3 hidden lg:table-cell">
                          <div className="flex items-center gap-1 text-slate-600">
                            <MapPin className="h-3 w-3 text-gold-500" />
                            {alumno.ciudad || '-'}{alumno.distrito ? `, ${alumno.distrito}` : ''}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-right">
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
              </>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
