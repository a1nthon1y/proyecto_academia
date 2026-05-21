'use client';

import { useState, useMemo } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { FormCrearPadre } from '@/components/padres/FormCrearPadre';
import { FormEditarPadre } from '@/components/padres/FormEditarPadre';
import { useQuery } from '@tanstack/react-query';
import { listarPadres } from '@/services/padresServiceTrabajador';
import { useEliminarPadre } from '@/hooks/usePadresMutations';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import {
  Plus, Mail, Phone, CheckCircle, XCircle, Pencil, Trash2,
  Users, Search, UserCheck,
} from 'lucide-react';
import Swal from 'sweetalert2';

export default function TrabajadorPadresPage() {
  const [view, setView] = useState('list');
  const [selectedPadre, setSelectedPadre] = useState(null);
  const [search, setSearch] = useState('');

  const { data: padres, isLoading, refetch } = useQuery({
    queryKey: ['padres', 'trabajador'],
    queryFn: listarPadres,
  });

  const eliminarMutation = useEliminarPadre();

  const filtrados = useMemo(() => {
    const list = padres || [];
    if (!search.trim()) return list;
    const s = search.trim().toLowerCase();
    return list.filter((p) =>
      `${p.nombres || ''} ${p.apellidos || ''}`.toLowerCase().includes(s) ||
      (p.dni || '').toLowerCase().includes(s) ||
      (p.email || '').toLowerCase().includes(s) ||
      (p.telefono || '').toLowerCase().includes(s)
    );
  }, [padres, search]);

  const stats = useMemo(() => {
    const list = padres || [];
    return {
      total: list.length,
      activos: list.filter((p) => p.activo).length,
      conEmail: list.filter((p) => p.email).length,
    };
  }, [padres]);

  const handleEdit = (padre) => {
    setSelectedPadre(padre);
    setView('edit');
  };

  const handleDelete = async (padre) => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: `Se eliminará al padre ${padre.nombres} ${padre.apellidos}. Esta acción no se puede deshacer.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    });
    if (result.isConfirmed) eliminarMutation.mutate(padre.id);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold text-navy-900">Padres de familia</h1>
            <p className="text-sm text-slate-600">Gestión de padres y apoderados</p>
          </div>
          {view === 'list' && (
            <button
              onClick={() => setView('create')}
              className="flex items-center gap-2 rounded-lg bg-navy-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-navy-700 transition"
            >
              <Plus className="h-4 w-4" />
              Nuevo padre
            </button>
          )}
          {view !== 'list' && (
            <button
              onClick={() => { setView('list'); setSelectedPadre(null); }}
              className="text-sm text-navy-600 hover:text-navy-800 hover:underline transition font-medium"
            >
              &larr; Volver a la lista
            </button>
          )}
        </div>

        {view === 'list' && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Total padres</p>
              <p className="mt-1 text-2xl font-bold text-navy-900">{stats.total}</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Activos</p>
              <p className="mt-1 text-2xl font-bold text-emerald-700">{stats.activos}</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Con email</p>
              <p className="mt-1 text-2xl font-bold text-blue-700">{stats.conEmail}</p>
            </div>
          </div>
        )}

        {view === 'create' ? (
          <FormCrearPadre onSuccess={() => { refetch(); setView('list'); }} />
        ) : view === 'edit' && selectedPadre ? (
          <FormEditarPadre
            padre={selectedPadre}
            onSuccess={() => { refetch(); setView('list'); setSelectedPadre(null); }}
            onCancel={() => { setView('list'); setSelectedPadre(null); }}
          />
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-slate-500" />
                <span className="text-sm font-medium text-slate-700">
                  {filtrados.length} de {stats.total} padres
                </span>
              </div>
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                <input
                  type="search"
                  placeholder="Buscar por nombre, DNI, email…"
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
                <UserCheck className="h-12 w-12 mx-auto text-slate-300 mb-3" />
                <p className="text-sm">
                  {stats.total === 0
                    ? 'No hay padres registrados aún.'
                    : 'No se encontraron padres con esa búsqueda.'}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-3">Nombre</th>
                      <th className="px-4 py-3 hidden md:table-cell">Contacto</th>
                      <th className="px-4 py-3">Estado</th>
                      <th className="px-4 py-3 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filtrados.map((padre) => (
                      <tr key={padre.id} className="hover:bg-slate-50 transition">
                        <td className="px-4 py-3">
                          <div className="font-medium text-navy-900">
                            {padre.apellidos}, {padre.nombres}
                          </div>
                          <div className="text-xs text-slate-500">DNI: {padre.dni}</div>
                        </td>
                        <td className="px-4 py-3 hidden md:table-cell">
                          <div className="flex items-center gap-2 text-slate-600">
                            <Mail className="h-3 w-3" />
                            {padre.email || '-'}
                          </div>
                          <div className="flex items-center gap-2 text-slate-600 mt-1">
                            <Phone className="h-3 w-3" />
                            {padre.telefono || '-'}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          {padre.activo ? (
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
                              onClick={() => handleEdit(padre)}
                              className="p-1.5 text-slate-500 hover:bg-slate-100 hover:text-navy-600 rounded-lg transition"
                              title="Editar"
                            >
                              <Pencil className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(padre)}
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
