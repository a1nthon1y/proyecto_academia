'use client';

import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { listarConsultas, cambiarEstadoConsulta } from '@/services/consultasService';
import {
  MessageSquare, Inbox, CheckCircle2, Clock, X,
  Phone, Mail, Search, ArrowRight, AlertCircle,
} from 'lucide-react';
import Swal from 'sweetalert2';

const ESTADOS = [
  { id: 'PENDIENTE',   label: 'Pendiente',   color: 'amber',   icon: Clock },
  { id: 'EN_CONTACTO', label: 'En contacto', color: 'blue',    icon: ArrowRight },
  { id: 'CONVERTIDA',  label: 'Convertida',  color: 'emerald', icon: CheckCircle2 },
  { id: 'DESCARTADA',  label: 'Descartada',  color: 'slate',   icon: X },
];

const COLOR_CLASSES = {
  amber: 'bg-amber-100 text-amber-700 border-amber-200',
  blue: 'bg-blue-100 text-blue-700 border-blue-200',
  emerald: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  slate: 'bg-slate-100 text-slate-600 border-slate-200',
};

const fmtDate = (d) =>
  d ? new Date(d).toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '-';

function EstadoBadge({ estado }) {
  const e = ESTADOS.find((x) => x.id === estado) || ESTADOS[0];
  const Icon = e.icon;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${COLOR_CLASSES[e.color]}`}>
      <Icon className="h-3 w-3" />
      {e.label}
    </span>
  );
}

function ConsultaDetail({ consulta, onClose, onChangeEstado }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between bg-navy-50/30">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-navy-600" />
          <h3 className="text-base font-semibold text-navy-900">
            Consulta #{consulta.id}
          </h3>
          <EstadoBadge estado={consulta.estado} />
        </div>
        <button onClick={onClose} className="p-1.5 hover:bg-slate-100 rounded-lg transition">
          <X className="h-4 w-4 text-slate-500" />
        </button>
      </div>

      <div className="p-5 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Nombre</p>
            <p className="mt-0.5 font-medium text-slate-900">{consulta.nombres}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Recibida</p>
            <p className="mt-0.5 text-slate-700">{fmtDate(consulta.fecha_registro || consulta.creado_en)}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Teléfono</p>
            <a href={`tel:${consulta.telefono}`} className="mt-0.5 inline-flex items-center gap-1 text-navy-600 hover:underline">
              <Phone className="h-3.5 w-3.5" />
              {consulta.telefono || '-'}
            </a>
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Email</p>
            {consulta.email ? (
              <a href={`mailto:${consulta.email}`} className="mt-0.5 inline-flex items-center gap-1 text-navy-600 hover:underline">
                <Mail className="h-3.5 w-3.5" />
                {consulta.email}
              </a>
            ) : (
              <p className="mt-0.5 text-slate-400">—</p>
            )}
          </div>
        </div>

        {consulta.mensaje && (
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Mensaje</p>
            <div className="rounded-lg bg-slate-50 border border-slate-100 px-3 py-2.5 text-sm text-slate-700 whitespace-pre-wrap">
              {consulta.mensaje}
            </div>
          </div>
        )}

        <div className="pt-2 border-t border-slate-100">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">Cambiar estado</p>
          <div className="flex flex-wrap gap-2">
            {ESTADOS.map((e) => (
              <button
                key={e.id}
                disabled={e.id === consulta.estado}
                onClick={() => onChangeEstado(consulta.id, e.id)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition ${
                  e.id === consulta.estado
                    ? `${COLOR_CLASSES[e.color]} cursor-default opacity-70`
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                }`}
              >
                <e.icon className="h-3.5 w-3.5" />
                {e.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TrabajadorConsultasPage() {
  const queryClient = useQueryClient();
  const [filtro, setFiltro] = useState('TODOS');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);

  const { data: consultas, isLoading } = useQuery({
    queryKey: ['consultas'],
    queryFn: listarConsultas,
  });

  const cambiarMutation = useMutation({
    mutationFn: ({ id, estado }) => cambiarEstadoConsulta(id, estado),
    onSuccess: () => {
      Swal.fire({ icon: 'success', title: 'Estado actualizado', timer: 1200, showConfirmButton: false });
      queryClient.invalidateQueries({ queryKey: ['consultas'] });
      setSelected(null);
    },
    onError: (e) => {
      Swal.fire({ icon: 'error', title: 'Error', text: e?.message || 'No se pudo actualizar' });
    },
  });

  const filtradas = useMemo(() => {
    let list = consultas || [];
    if (filtro !== 'TODOS') {
      list = list.filter((c) => (c.estado || 'PENDIENTE') === filtro);
    }
    if (search.trim()) {
      const s = search.trim().toLowerCase();
      list = list.filter((c) =>
        (c.nombres || '').toLowerCase().includes(s) ||
        (c.telefono || '').toLowerCase().includes(s) ||
        (c.email || '').toLowerCase().includes(s)
      );
    }
    return list;
  }, [consultas, filtro, search]);

  const stats = useMemo(() => {
    const base = { TODOS: (consultas || []).length };
    ESTADOS.forEach((e) => {
      base[e.id] = (consultas || []).filter((c) => (c.estado || 'PENDIENTE') === e.id).length;
    });
    return base;
  }, [consultas]);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-navy-900">Consultas y leads</h1>
          <p className="text-sm text-slate-600 mt-0.5">
            Bandeja de entrada de las consultas recibidas desde la página pública.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {ESTADOS.map((e) => {
            const Icon = e.icon;
            return (
              <button
                key={e.id}
                onClick={() => setFiltro(filtro === e.id ? 'TODOS' : e.id)}
                className={`text-left rounded-xl border bg-white p-3 shadow-sm transition hover:shadow ${
                  filtro === e.id ? 'border-navy-400 ring-2 ring-navy-100' : 'border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">{e.label}</p>
                  <Icon className={`h-4 w-4 ${
                    e.color === 'amber' ? 'text-amber-500' :
                    e.color === 'blue' ? 'text-blue-500' :
                    e.color === 'emerald' ? 'text-emerald-500' : 'text-slate-400'
                  }`} />
                </div>
                <p className="mt-1.5 text-2xl font-bold text-navy-900">{stats[e.id] || 0}</p>
              </button>
            );
          })}
        </div>

        {selected && (
          <ConsultaDetail
            consulta={selected}
            onClose={() => setSelected(null)}
            onChangeEstado={(id, estado) => cambiarMutation.mutate({ id, estado })}
          />
        )}

        {/* Tabla */}
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <Inbox className="h-4 w-4 text-slate-500" />
              <span className="text-sm font-medium text-slate-700">
                {filtradas.length} de {stats.TODOS} consultas
                {filtro !== 'TODOS' && (
                  <button
                    onClick={() => setFiltro('TODOS')}
                    className="ml-2 text-xs text-navy-600 hover:underline"
                  >
                    quitar filtro
                  </button>
                )}
              </span>
            </div>
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <input
                type="search"
                placeholder="Buscar por nombre, teléfono…"
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
              <Inbox className="h-12 w-12 mx-auto text-slate-300 mb-3" />
              <p className="text-sm">
                {stats.TODOS === 0
                  ? 'Aún no hay consultas recibidas desde la web.'
                  : 'No hay consultas con los filtros aplicados.'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3">Contacto</th>
                    <th className="px-4 py-3 hidden md:table-cell">Email / Teléfono</th>
                    <th className="px-4 py-3 hidden lg:table-cell">Recibida</th>
                    <th className="px-4 py-3">Estado</th>
                    <th className="px-4 py-3 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filtradas.map((c) => (
                    <tr
                      key={c.id}
                      className="hover:bg-slate-50 transition cursor-pointer"
                      onClick={() => setSelected(c)}
                    >
                      <td className="px-4 py-3">
                        <div className="font-medium text-slate-900">{c.nombres}</div>
                        <div className="md:hidden text-xs text-slate-500">{c.telefono}</div>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <div className="text-slate-700 truncate max-w-[18rem]">{c.email || '—'}</div>
                        <div className="text-xs text-slate-500">{c.telefono || '—'}</div>
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell text-slate-600 text-xs">
                        {fmtDate(c.fecha_registro || c.creado_en)}
                      </td>
                      <td className="px-4 py-3"><EstadoBadge estado={c.estado || 'PENDIENTE'} /></td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={(e) => { e.stopPropagation(); setSelected(c); }}
                          className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-lg bg-navy-50 text-navy-700 hover:bg-navy-100 transition"
                        >
                          Ver
                          <ArrowRight className="h-3 w-3" />
                        </button>
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
