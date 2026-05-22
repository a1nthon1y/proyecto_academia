'use client';

import { Suspense, useState, useMemo } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { FormCrearTutor } from '@/components/tutores/FormCrearTutor';
import { FormEditarTutor } from '@/components/tutores/FormEditarTutor';
import { useQuery } from '@tanstack/react-query';
import { listarTutores } from '@/services/tutoresServiceTrabajador';
import { useDesactivarTutor, useReactivarTutor } from '@/hooks/useTutoresMutations';
import { usePageMode } from '@/hooks/usePageMode';
import { PageHeader } from '@/components/shared/PageHeader';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import {
  Plus, MapPin, Phone, Mail, CheckCircle, XCircle, Pencil, UserMinus, UserCheck,
  Users, Search, GraduationCap,
} from 'lucide-react';
import Swal from 'sweetalert2';

export default function TrabajadorTutoresPage() {
  return (
    <Suspense fallback={<div className="p-12 flex justify-center"><LoadingSpinner /></div>}>
      <TutoresPageContent />
    </Suspense>
  );
}

function TutoresPageContent() {
  const { mode, id: editingId, openCreate, openEdit, backToList } = usePageMode();
  const [search, setSearch] = useState('');
  const [mostrarInactivos, setMostrarInactivos] = useState(false);

  const { data: tutores, isLoading, refetch } = useQuery({
    queryKey: ['tutores', 'trabajador', mostrarInactivos],
    queryFn: () => listarTutores(mostrarInactivos),
  });

  const selectedTutor = useMemo(
    () => (tutores || []).find((t) => t.id === editingId) || null,
    [tutores, editingId]
  );

  const desactivarMutation = useDesactivarTutor();
  const reactivarMutation = useReactivarTutor();

  const filtrados = useMemo(() => {
    const list = tutores || [];
    if (!search.trim()) return list;
    const s = search.trim().toLowerCase();
    return list.filter((t) =>
      `${t.nombres || ''} ${t.apellidos || ''}`.toLowerCase().includes(s) ||
      (t.especialidad || '').toLowerCase().includes(s) ||
      (t.email || '').toLowerCase().includes(s) ||
      (t.telefono || '').toLowerCase().includes(s)
    );
  }, [tutores, search]);

  const stats = useMemo(() => {
    const list = tutores || [];
    const activos = list.filter((t) => t.activo).length;
    return {
      total: list.length,
      activos,
      inactivos: list.length - activos,
      especialidades: new Set(list.map((t) => t.especialidad).filter(Boolean)).size,
    };
  }, [tutores]);

  const handleEdit = (tutor) => {
    openEdit(tutor.id);
  };

  const handleDesactivar = async (tutor) => {
    const result = await Swal.fire({
      title: `¿Desactivar a ${tutor.nombres}?`,
      html: `
        <p class="text-sm text-slate-600">
          El tutor <b>${tutor.nombres} ${tutor.apellidos}</b> ya no aparecerá en las
          listas activas, pero todo su historial (matrículas, asistencias, pagos)
          se conserva.
        </p>
        <p class="text-xs text-slate-500 mt-3">
          Si vuelve a la academia podrás reactivarlo desde la opción
          <b>"Mostrar inactivos"</b>.
        </p>
      `,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Sí, desactivar',
      cancelButtonText: 'Cancelar',
    });
    if (result.isConfirmed) desactivarMutation.mutate(tutor.id);
  };

  const handleReactivar = async (tutor) => {
    const result = await Swal.fire({
      title: `¿Reactivar a ${tutor.nombres}?`,
      text: `El tutor ${tutor.nombres} ${tutor.apellidos} volverá a aparecer como activo y podrá ser asignado a nuevas matrículas.`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#059669',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Sí, reactivar',
      cancelButtonText: 'Cancelar',
    });
    if (result.isConfirmed) reactivarMutation.mutate(tutor.id);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <PageHeader
          title="Tutores"
          subtitle={
            mode === 'crear'
              ? 'Registrar un nuevo tutor docente'
              : mode === 'editar' && selectedTutor
                ? `${selectedTutor.nombres} ${selectedTutor.apellidos}`
                : 'Gestión de personal docente'
          }
          mode={mode}
          onBack={backToList}
          actions={
            <button
              onClick={openCreate}
              className="flex items-center gap-2 rounded-lg bg-navy-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-navy-700 transition"
            >
              <Plus className="h-4 w-4" />
              Nuevo tutor
            </button>
          }
        />

        {mode === 'lista' && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                {mostrarInactivos ? 'Total mostrados' : 'Tutores activos'}
              </p>
              <p className="mt-1 text-2xl font-bold text-navy-900">{stats.total}</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Activos</p>
              <p className="mt-1 text-2xl font-bold text-emerald-700">{stats.activos}</p>
            </div>
            {mostrarInactivos && (
              <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Inactivos</p>
                <p className="mt-1 text-2xl font-bold text-slate-500">{stats.inactivos}</p>
              </div>
            )}
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Especialidades</p>
              <p className="mt-1 text-2xl font-bold text-blue-700">{stats.especialidades}</p>
            </div>
          </div>
        )}

        {mode === 'crear' ? (
          <FormCrearTutor onSuccess={() => { refetch(); backToList(); }} />
        ) : mode === 'editar' && selectedTutor ? (
          <FormEditarTutor
            tutor={selectedTutor}
            onSuccess={() => { refetch(); backToList(); }}
            onCancel={backToList}
          />
        ) : mode === 'editar' && !selectedTutor ? (
          <div className="rounded-xl bg-white p-12 text-center shadow-sm ring-1 ring-slate-200">
            <p className="text-sm text-slate-500">Tutor no encontrado.</p>
            <button onClick={backToList} className="mt-3 text-sm font-medium text-navy-600 hover:underline">
              Volver a la lista
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-3 flex-wrap">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-slate-500" />
                  <span className="text-sm font-medium text-slate-700">
                    {filtrados.length} de {stats.total} tutores
                  </span>
                </div>
                <label className="flex items-center gap-2 cursor-pointer select-none ml-2">
                  <input
                    type="checkbox"
                    checked={mostrarInactivos}
                    onChange={(e) => setMostrarInactivos(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-navy-600 focus:ring-navy-500"
                  />
                  <span className="text-sm text-slate-600">Mostrar inactivos</span>
                </label>
              </div>
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                <input
                  type="search"
                  placeholder="Buscar por nombre, especialidad, email…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-72 pl-8 pr-3 py-1.5 text-sm rounded-lg border border-slate-300 focus:border-navy-500 focus:ring-2 focus:ring-navy-100 outline-none"
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
                    ? 'No hay tutores registrados aún.'
                    : 'No se encontraron tutores con esa búsqueda.'}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-3">Tutor</th>
                      <th className="px-4 py-3 hidden md:table-cell">Contacto</th>
                      <th className="px-4 py-3 hidden lg:table-cell">Ubicación</th>
                      <th className="px-4 py-3">Estado</th>
                      <th className="px-4 py-3 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filtrados.map((tutor) => (
                      <tr
                        key={tutor.id}
                        className={`hover:bg-slate-50 transition ${!tutor.activo ? 'bg-slate-50/60 opacity-75' : ''}`}
                      >
                        <td className="px-4 py-3">
                          <div className={`font-medium ${tutor.activo ? 'text-navy-900' : 'text-slate-600'}`}>
                            {tutor.apellidos}, {tutor.nombres}
                          </div>
                          <div className="text-xs text-slate-500">
                            {tutor.especialidad || 'Sin especialidad'}
                          </div>
                        </td>
                        <td className="px-4 py-3 hidden md:table-cell">
                          <div className="flex items-center gap-2 text-slate-600">
                            <Mail className="h-3 w-3" />
                            {tutor.email || '-'}
                          </div>
                          <div className="flex items-center gap-2 text-slate-600 mt-1">
                            <Phone className="h-3 w-3" />
                            {tutor.telefono || '-'}
                          </div>
                        </td>
                        <td className="px-4 py-3 hidden lg:table-cell">
                          <div className="flex items-center gap-1 text-slate-600">
                            <MapPin className="h-3 w-3 text-gold-500" />
                            {tutor.ciudad || '-'}{tutor.distrito ? `, ${tutor.distrito}` : ''}
                          </div>
                        </td>
                        <td className="px-4 py-3">
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
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleEdit(tutor)}
                              className="p-1.5 text-slate-500 hover:bg-slate-100 hover:text-navy-600 rounded-lg transition"
                              title="Editar"
                            >
                              <Pencil className="h-4 w-4" />
                            </button>
                            {tutor.activo ? (
                              <button
                                onClick={() => handleDesactivar(tutor)}
                                className="p-1.5 text-slate-500 hover:bg-amber-50 hover:text-amber-600 rounded-lg transition"
                                title="Desactivar (conserva el historial)"
                              >
                                <UserMinus className="h-4 w-4" />
                              </button>
                            ) : (
                              <button
                                onClick={() => handleReactivar(tutor)}
                                className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition"
                                title="Reactivar tutor"
                              >
                                <UserCheck className="h-4 w-4" />
                              </button>
                            )}
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
