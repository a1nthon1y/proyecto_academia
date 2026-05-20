'use client';

import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { getMisAsistencias, getMisHijos } from '@/services/padresService';
import { listarMisPagosPadre } from '@/services/pagosService';
import {
  Calendar, Clock, User, CheckCircle2, XCircle,
  Receipt, History, BookOpen, ListChecks, DollarSign,
} from 'lucide-react';

const fmtDate = (d) =>
  d ? new Date(d).toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' }) : '-';

const fmtHora = (h) => (h ? h.slice(0, 5) : '-');

const fmtMoney = (n) =>
  new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(Number(n || 0));

function TabButton({ active, onClick, icon: Icon, children, count }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border-b-2 transition ${
        active
          ? 'border-navy-600 text-navy-700'
          : 'border-transparent text-slate-500 hover:text-slate-700'
      }`}
    >
      <Icon className="h-4 w-4" />
      {children}
      {typeof count === 'number' && (
        <span className={`ml-1 inline-flex items-center justify-center min-w-[1.4rem] h-5 px-1.5 text-[11px] font-semibold rounded-full ${
          active ? 'bg-navy-100 text-navy-700' : 'bg-slate-100 text-slate-600'
        }`}>
          {count}
        </span>
      )}
    </button>
  );
}

function HistorialAsistencias({ asistencias, loading }) {
  if (loading) return <div className="p-12 flex justify-center"><LoadingSpinner /></div>;
  if (!asistencias || asistencias.length === 0) {
    return (
      <div className="p-12 text-center text-slate-500">
        <Calendar className="h-12 w-12 mx-auto text-slate-300 mb-3" />
        <p className="text-sm">Aún no hay sesiones registradas para tus hijos.</p>
      </div>
    );
  }

  // Agrupar por mes
  const grouped = asistencias.reduce((acc, a) => {
    const d = a.fecha ? new Date(a.fecha) : new Date();
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    const label = d.toLocaleDateString('es-PE', { month: 'long', year: 'numeric' });
    if (!acc[key]) acc[key] = { label, items: [] };
    acc[key].items.push(a);
    return acc;
  }, {});

  return (
    <div className="divide-y divide-slate-100">
      {Object.entries(grouped)
        .sort(([a], [b]) => b.localeCompare(a))
        .map(([key, { label, items }]) => (
          <div key={key} className="p-4">
            <div className="mb-3 flex items-center gap-2">
              <h3 className="text-sm font-semibold text-navy-700 capitalize">{label}</h3>
              <span className="text-xs text-slate-500">· {items.length} sesion{items.length !== 1 ? 'es' : ''}</span>
            </div>
            <div className="space-y-2">
              {items.map((a) => (
                <div
                  key={a.id}
                  className="rounded-lg border border-slate-200 bg-white p-3 hover:bg-slate-50 transition"
                >
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <div className="flex items-center gap-1.5 text-sm font-medium text-slate-900">
                          <User className="h-3.5 w-3.5 text-slate-400" />
                          {a.alumno || 'Alumno'}
                        </div>
                        {a.curso && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-navy-50 text-navy-700">
                            <BookOpen className="h-3 w-3" /> {a.curso}
                          </span>
                        )}
                      </div>
                      <div className="mt-1.5 flex items-center gap-3 text-xs text-slate-600 flex-wrap">
                        <span className="inline-flex items-center gap-1">
                          <Calendar className="h-3 w-3" /> {fmtDate(a.fecha)}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <Clock className="h-3 w-3" /> {fmtHora(a.hora_llegada_tutor)}
                        </span>
                        {a.tutor && (
                          <span className="inline-flex items-center gap-1">
                            Tutor: <span className="font-medium text-slate-700">{a.tutor}</span>
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col gap-1 flex-shrink-0">
                      {a.confirmado_tutor ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
                          <CheckCircle2 className="h-3 w-3" /> Tutor confirmó
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-500">
                          <XCircle className="h-3 w-3" /> Tutor pendiente
                        </span>
                      )}
                      {a.confirmado_padre ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
                          <CheckCircle2 className="h-3 w-3" /> Confirmaste
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
                          <XCircle className="h-3 w-3" /> Por confirmar
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
    </div>
  );
}

function HistorialPagos({ pagos, loading }) {
  if (loading) return <div className="p-12 flex justify-center"><LoadingSpinner /></div>;
  if (!pagos || pagos.length === 0) {
    return (
      <div className="p-12 text-center text-slate-500">
        <Receipt className="h-12 w-12 mx-auto text-slate-300 mb-3" />
        <p className="text-sm">No tienes pagos registrados aún.</p>
      </div>
    );
  }

  const total = pagos.reduce((s, p) => s + Number(p.monto || 0), 0);

  return (
    <div>
      <div className="px-4 py-3 bg-navy-50/40 border-b border-slate-200 flex items-center justify-between flex-wrap gap-2">
        <span className="text-xs text-slate-600 font-medium">{pagos.length} pago{pagos.length !== 1 ? 's' : ''}</span>
        <span className="text-sm font-semibold text-navy-900">Total pagado: {fmtMoney(total)}</span>
      </div>
      <table className="w-full text-sm text-left">
        <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
          <tr>
            <th className="px-4 py-3">Fecha</th>
            <th className="px-4 py-3">Monto</th>
            <th className="px-4 py-3 hidden sm:table-cell">Método</th>
            <th className="px-4 py-3 hidden md:table-cell">Referencia</th>
            <th className="px-4 py-3">Estado</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {pagos.map((p) => (
            <tr key={p.id} className="hover:bg-slate-50 transition">
              <td className="px-4 py-3 text-slate-700">{fmtDate(p.fecha_pago)}</td>
              <td className="px-4 py-3 font-semibold text-emerald-700">{fmtMoney(p.monto)}</td>
              <td className="px-4 py-3 hidden sm:table-cell text-slate-600">{p.metodo_pago || '-'}</td>
              <td className="px-4 py-3 hidden md:table-cell text-slate-500 text-xs">{p.referencia || '—'}</td>
              <td className="px-4 py-3">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
                  <CheckCircle2 className="h-3 w-3" /> {p.estado || 'PAGADO'}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function PadreHistorialPage() {
  const [tab, setTab] = useState('sesiones');

  const { data: asistencias, isLoading: loadingAsist } = useQuery({
    queryKey: ['padre', 'asistencias'],
    queryFn: getMisAsistencias,
  });

  const { data: pagos, isLoading: loadingPagos } = useQuery({
    queryKey: ['padre', 'mis-pagos'],
    queryFn: listarMisPagosPadre,
  });

  const { data: hijos } = useQuery({
    queryKey: ['padre', 'mis-hijos'],
    queryFn: getMisHijos,
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-navy-900">Historial</h1>
          <p className="text-sm text-slate-600 mt-0.5">
            Resumen de las sesiones de tus hijos y tus pagos realizados.
          </p>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Hijos</p>
                <p className="mt-1 text-2xl font-bold text-navy-900">{(hijos || []).length}</p>
              </div>
              <div className="rounded-lg bg-navy-50 p-2.5">
                <User className="h-5 w-5 text-navy-600" />
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Sesiones</p>
                <p className="mt-1 text-2xl font-bold text-blue-700">{(asistencias || []).length}</p>
              </div>
              <div className="rounded-lg bg-blue-50 p-2.5">
                <ListChecks className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Total pagado</p>
                <p className="mt-1 text-2xl font-bold text-emerald-700">
                  {fmtMoney((pagos || []).reduce((s, p) => s + Number(p.monto || 0), 0))}
                </p>
              </div>
              <div className="rounded-lg bg-emerald-50 p-2.5">
                <DollarSign className="h-5 w-5 text-emerald-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="flex items-center gap-1 border-b border-slate-200 px-3">
            <TabButton
              active={tab === 'sesiones'}
              onClick={() => setTab('sesiones')}
              icon={History}
              count={(asistencias || []).length}
            >
              Sesiones
            </TabButton>
            <TabButton
              active={tab === 'pagos'}
              onClick={() => setTab('pagos')}
              icon={Receipt}
              count={(pagos || []).length}
            >
              Mis pagos
            </TabButton>
          </div>

          {tab === 'sesiones' ? (
            <HistorialAsistencias asistencias={asistencias} loading={loadingAsist} />
          ) : (
            <HistorialPagos pagos={pagos} loading={loadingPagos} />
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
