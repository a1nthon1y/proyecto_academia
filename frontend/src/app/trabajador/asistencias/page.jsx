'use client';

import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { listarAsistencias } from '@/services/asistenciasService';
import {
  ClipboardList, MapPin, Calendar, CheckCircle2,
  XCircle, Search, Clock, User, BookOpen,
} from 'lucide-react';

const fmtDate = (d) =>
  d ? new Date(d).toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' }) : '-';

const fmtHora = (h) => h ? h.slice(0, 5) : '-';

function BadgeConfirmado({ ok, label }) {
  return ok ? (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
      <CheckCircle2 className="h-3 w-3" /> {label}
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-500">
      <XCircle className="h-3 w-3" /> {label}
    </span>
  );
}

export default function TrabajadorAsistenciasPage() {
  const { data: asistencias, isLoading } = useQuery({
    queryKey: ['asistencias'],
    queryFn: listarAsistencias,
  });

  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('TODOS'); // TODOS | CONFIRMADO | PENDIENTE

  const filtradas = useMemo(() => {
    let list = asistencias || [];
    if (filter === 'CONFIRMADO') {
      list = list.filter((a) => a.confirmado_tutor && a.confirmado_padre);
    } else if (filter === 'PENDIENTE') {
      list = list.filter((a) => !(a.confirmado_tutor && a.confirmado_padre));
    }
    if (search.trim()) {
      const s = search.trim().toLowerCase();
      list = list.filter((a) =>
        (a.alumno || '').toLowerCase().includes(s) ||
        (a.tutor || '').toLowerCase().includes(s) ||
        (a.curso || '').toLowerCase().includes(s)
      );
    }
    return list;
  }, [asistencias, filter, search]);

  const stats = useMemo(() => {
    const all = asistencias || [];
    return {
      total: all.length,
      confirmadas: all.filter((a) => a.confirmado_tutor && a.confirmado_padre).length,
      pendientes: all.filter((a) => !(a.confirmado_tutor && a.confirmado_padre)).length,
      hoy: all.filter((a) => {
        if (!a.fecha) return false;
        const f = new Date(a.fecha).toDateString();
        return f === new Date().toDateString();
      }).length,
    };
  }, [asistencias]);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-navy-900">Control de asistencias</h1>
          <p className="text-sm text-slate-600 mt-0.5">
            Asistencias registradas por tutores con verificación GPS y confirmación de padres.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Total registradas</p>
            <p className="mt-1 text-2xl font-bold text-navy-900">{stats.total}</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Hoy</p>
            <p className="mt-1 text-2xl font-bold text-blue-700">{stats.hoy}</p>
          </div>
          <button
            onClick={() => setFilter(filter === 'CONFIRMADO' ? 'TODOS' : 'CONFIRMADO')}
            className={`text-left rounded-xl border bg-white p-4 shadow-sm transition hover:shadow ${
              filter === 'CONFIRMADO' ? 'border-emerald-400 ring-2 ring-emerald-100' : 'border-slate-200'
            }`}
          >
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Confirmadas</p>
            <p className="mt-1 text-2xl font-bold text-emerald-700">{stats.confirmadas}</p>
          </button>
          <button
            onClick={() => setFilter(filter === 'PENDIENTE' ? 'TODOS' : 'PENDIENTE')}
            className={`text-left rounded-xl border bg-white p-4 shadow-sm transition hover:shadow ${
              filter === 'PENDIENTE' ? 'border-amber-400 ring-2 ring-amber-100' : 'border-slate-200'
            }`}
          >
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Pendientes</p>
            <p className="mt-1 text-2xl font-bold text-amber-600">{stats.pendientes}</p>
          </button>
        </div>

        {/* Tabla */}
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <ClipboardList className="h-4 w-4 text-slate-500" />
              <span className="text-sm font-medium text-slate-700">
                {filtradas.length} de {stats.total} asistencias
                {filter !== 'TODOS' && (
                  <button onClick={() => setFilter('TODOS')} className="ml-2 text-xs text-navy-600 hover:underline">
                    quitar filtro
                  </button>
                )}
              </span>
            </div>
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <input
                type="search"
                placeholder="Buscar alumno, tutor, curso…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full sm:w-72 pl-8 pr-3 py-1.5 text-sm rounded-lg border border-slate-300 focus:border-navy-500 focus:ring-2 focus:ring-navy-100 outline-none"
              />
            </div>
          </div>

          {isLoading ? (
            <div className="p-12 flex justify-center"><LoadingSpinner /></div>
          ) : filtradas.length === 0 ? (
            <div className="p-12 text-center text-slate-500">
              <ClipboardList className="h-12 w-12 mx-auto text-slate-300 mb-3" />
              <p className="text-sm">
                {stats.total === 0
                  ? 'Aún no se han registrado asistencias.'
                  : 'No hay asistencias con los filtros aplicados.'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3">Fecha</th>
                    <th className="px-4 py-3">Alumno</th>
                    <th className="px-4 py-3 hidden md:table-cell">Tutor</th>
                    <th className="px-4 py-3 hidden md:table-cell">Curso</th>
                    <th className="px-4 py-3">Hora</th>
                    <th className="px-4 py-3">Confirmaciones</th>
                    <th className="px-4 py-3">GPS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filtradas.map((a) => (
                    <tr key={a.id} className="hover:bg-slate-50 transition">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5 text-slate-700 font-medium">
                          <Calendar className="h-3.5 w-3.5 text-slate-400" />
                          {fmtDate(a.fecha)}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <User className="h-3.5 w-3.5 text-slate-400" />
                          <span className="font-medium text-slate-900">{a.alumno || '-'}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell text-slate-600">{a.tutor || '-'}</td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <div className="flex items-center gap-1 text-slate-600">
                          <BookOpen className="h-3 w-3" />
                          {a.curso || '-'}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1 text-slate-700">
                          <Clock className="h-3.5 w-3.5 text-slate-400" />
                          {fmtHora(a.hora_llegada_tutor)}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-col gap-1">
                          <BadgeConfirmado ok={a.confirmado_tutor} label="Tutor" />
                          <BadgeConfirmado ok={a.confirmado_padre} label="Padre" />
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        {a.ubicacion_lat && a.ubicacion_lng ? (
                          <a
                            href={`https://www.google.com/maps?q=${a.ubicacion_lat},${a.ubicacion_lng}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700 hover:bg-blue-200 transition"
                          >
                            <MapPin className="h-3 w-3" /> Ver mapa
                          </a>
                        ) : (
                          <span className="text-xs text-slate-400">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
