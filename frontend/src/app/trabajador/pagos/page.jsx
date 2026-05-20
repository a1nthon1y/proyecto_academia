'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import {
  listarPagosPadres,
  registrarPagoPadre,
  listarPagosTutores,
  generarPagosTutores,
  pagarTutor,
} from '@/services/pagosService';
import { listarMatriculas } from '@/services/matriculasService';
import { listarTutores } from '@/services/tutoresServiceTrabajador';
import { listarContratos } from '@/services/contratosService';
import {
  DollarSign, Plus, Receipt, Users, Calendar,
  CheckCircle2, AlertCircle, Wallet, Calculator,
} from 'lucide-react';
import Swal from 'sweetalert2';

const METODOS_PAGO = ['EFECTIVO', 'TRANSFERENCIA', 'YAPE', 'PLIN', 'TARJETA'];

const fmtMoney = (n) =>
  new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(Number(n || 0));

const fmtDate = (d) =>
  d ? new Date(d).toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' }) : '-';

function TabButton({ active, onClick, icon: Icon, children, count }) {
  return (
    <button
      onClick={onClick}
      className={`relative flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border-b-2 transition ${
        active
          ? 'border-navy-600 text-navy-700'
          : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
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

function FormRegistrarPagoPadre({ onSuccess, onCancel }) {
  const queryClient = useQueryClient();
  const { data: matriculas } = useQuery({
    queryKey: ['matriculas'],
    queryFn: listarMatriculas,
  });

  const [form, setForm] = useState({
    matricula_id: '',
    monto: '',
    metodo_pago: 'EFECTIVO',
    referencia: '',
  });
  const [error, setError] = useState('');

  const matriculasActivas = (matriculas || []).filter((m) => m.estado === 'ACTIVO');
  const seleccionada = matriculasActivas.find((m) => String(m.id) === String(form.matricula_id));

  const mutation = useMutation({
    mutationFn: registrarPagoPadre,
    onSuccess: () => {
      Swal.fire({ icon: 'success', title: 'Pago registrado', timer: 1400, showConfirmButton: false });
      queryClient.invalidateQueries({ queryKey: ['pagos-padres'] });
      onSuccess?.();
    },
    onError: (e) => {
      setError(e?.message || 'No se pudo registrar el pago');
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (!form.matricula_id || !form.monto) {
      setError('Matrícula y monto son obligatorios');
      return;
    }
    if (!seleccionada) {
      setError('Matrícula no encontrada');
      return;
    }
    mutation.mutate({
      padre_id: seleccionada.padre_id || null,
      matricula_id: Number(form.matricula_id),
      monto: Number(form.monto),
      metodo_pago: form.metodo_pago,
      referencia: form.referencia || null,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
      <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
        <Receipt className="h-5 w-5 text-navy-600" />
        <h3 className="text-base font-semibold text-navy-900">Registrar pago de padre</h3>
      </div>

      {error && (
        <div className="flex items-start gap-2 rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">
          <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className="block text-xs font-medium text-slate-700 mb-1">
            Matrícula activa <span className="text-red-500">*</span>
          </label>
          <select
            value={form.matricula_id}
            onChange={(e) => setForm({ ...form, matricula_id: e.target.value })}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-navy-500 focus:ring-2 focus:ring-navy-100 outline-none"
            required
          >
            <option value="">— Seleccionar —</option>
            {matriculasActivas.map((m) => (
              <option key={m.id} value={m.id}>
                #{m.id} · {m.alumno} · {m.curso} · {fmtMoney(m.curso_costo)}
              </option>
            ))}
          </select>
          {seleccionada && (
            <p className="mt-1.5 text-xs text-slate-500">
              Padre: <span className="font-medium text-slate-700">{seleccionada.padre}</span>
              {seleccionada.curso_costo && (
                <> · Costo mensual: <span className="font-medium text-slate-700">{fmtMoney(seleccionada.curso_costo)}</span></>
              )}
            </p>
          )}
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">
            Monto (S/) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={form.monto}
            onChange={(e) => setForm({ ...form, monto: e.target.value })}
            placeholder="350.00"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-navy-500 focus:ring-2 focus:ring-navy-100 outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">Método de pago</label>
          <select
            value={form.metodo_pago}
            onChange={(e) => setForm({ ...form, metodo_pago: e.target.value })}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-navy-500 focus:ring-2 focus:ring-navy-100 outline-none"
          >
            {METODOS_PAGO.map((m) => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="block text-xs font-medium text-slate-700 mb-1">Referencia / Operación</label>
          <input
            type="text"
            value={form.referencia}
            onChange={(e) => setForm({ ...form, referencia: e.target.value })}
            placeholder="N° de operación, voucher, etc. (opcional)"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-navy-500 focus:ring-2 focus:ring-navy-100 outline-none"
          />
        </div>
      </div>

      <div className="flex items-center justify-end gap-2 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 transition"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={mutation.isPending}
          className="inline-flex items-center gap-2 rounded-lg bg-navy-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-navy-700 transition disabled:opacity-50"
        >
          <Receipt className="h-4 w-4" />
          {mutation.isPending ? 'Registrando…' : 'Registrar pago'}
        </button>
      </div>
    </form>
  );
}

function FormGenerarOpagarTutor({ onSuccess, onCancel }) {
  const queryClient = useQueryClient();
  const { data: tutores } = useQuery({ queryKey: ['tutores'], queryFn: listarTutores });
  const { data: contratos } = useQuery({ queryKey: ['contratos'], queryFn: listarContratos });

  const [tab, setTab] = useState('generar'); // generar | pagar
  const [periodo, setPeriodo] = useState(() => {
    const d = new Date();
    return `${d.toLocaleString('es-PE', { month: 'long' })} ${d.getFullYear()}`;
  });
  const [form, setForm] = useState({ tutor_id: '', contrato_id: '', monto: '', periodo: '' });
  const [error, setError] = useState('');

  const generarMut = useMutation({
    mutationFn: () => generarPagosTutores(periodo),
    onSuccess: () => {
      Swal.fire({ icon: 'success', title: 'Pagos generados', timer: 1400, showConfirmButton: false });
      queryClient.invalidateQueries({ queryKey: ['pagos-tutores'] });
      onSuccess?.();
    },
    onError: (e) => setError(e?.message || 'No se pudo generar'),
  });

  const pagarMut = useMutation({
    mutationFn: pagarTutor,
    onSuccess: () => {
      Swal.fire({ icon: 'success', title: 'Pago a tutor registrado', timer: 1400, showConfirmButton: false });
      queryClient.invalidateQueries({ queryKey: ['pagos-tutores'] });
      onSuccess?.();
    },
    onError: (e) => setError(e?.message || 'No se pudo pagar'),
  });

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
      <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
        <Wallet className="h-5 w-5 text-navy-600" />
        <h3 className="text-base font-semibold text-navy-900">Pagos a tutores</h3>
      </div>

      <div className="flex gap-2 border-b border-slate-100">
        <button
          onClick={() => { setTab('generar'); setError(''); }}
          className={`px-3 py-2 text-sm font-medium border-b-2 transition ${tab === 'generar' ? 'border-navy-600 text-navy-700' : 'border-transparent text-slate-500'}`}
        >
          <Calculator className="inline h-4 w-4 mr-1" /> Generar mensual
        </button>
        <button
          onClick={() => { setTab('pagar'); setError(''); }}
          className={`px-3 py-2 text-sm font-medium border-b-2 transition ${tab === 'pagar' ? 'border-navy-600 text-navy-700' : 'border-transparent text-slate-500'}`}
        >
          <DollarSign className="inline h-4 w-4 mr-1" /> Pagar tutor
        </button>
      </div>

      {error && (
        <div className="flex items-start gap-2 rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">
          <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
          {error}
        </div>
      )}

      {tab === 'generar' ? (
        <div className="space-y-3">
          <p className="text-sm text-slate-600">
            Genera los pagos del período en base a las horas registradas y contratos activos.
          </p>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Período</label>
            <input
              type="text"
              value={periodo}
              onChange={(e) => setPeriodo(e.target.value)}
              placeholder="Mayo 2026"
              className="w-full md:w-72 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-navy-500 focus:ring-2 focus:ring-navy-100 outline-none"
            />
          </div>
          <div className="flex items-center justify-end gap-2 pt-2">
            <button type="button" onClick={onCancel} className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 transition">
              Cancelar
            </button>
            <button
              onClick={() => generarMut.mutate()}
              disabled={generarMut.isPending}
              className="inline-flex items-center gap-2 rounded-lg bg-navy-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-navy-700 transition disabled:opacity-50"
            >
              <Calculator className="h-4 w-4" />
              {generarMut.isPending ? 'Generando…' : 'Generar pagos del período'}
            </button>
          </div>
        </div>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setError('');
            if (!form.tutor_id || !form.monto) {
              setError('Tutor y monto son obligatorios');
              return;
            }
            pagarMut.mutate({
              tutor_id: Number(form.tutor_id),
              contrato_id: form.contrato_id ? Number(form.contrato_id) : null,
              monto: Number(form.monto),
              periodo: form.periodo || periodo,
            });
          }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Tutor <span className="text-red-500">*</span>
            </label>
            <select
              value={form.tutor_id}
              onChange={(e) => setForm({ ...form, tutor_id: e.target.value })}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-navy-500 focus:ring-2 focus:ring-navy-100 outline-none"
              required
            >
              <option value="">— Seleccionar —</option>
              {(tutores || []).map((t) => (
                <option key={t.id} value={t.id}>{t.apellidos}, {t.nombres} ({t.especialidad || 'Tutor'})</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Contrato (opcional)</label>
            <select
              value={form.contrato_id}
              onChange={(e) => setForm({ ...form, contrato_id: e.target.value })}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-navy-500 focus:ring-2 focus:ring-navy-100 outline-none"
            >
              <option value="">— Sin contrato específico —</option>
              {(contratos || []).filter(c => String(c.tutor_id) === String(form.tutor_id)).map((c) => (
                <option key={c.id} value={c.id}>#{c.id} · {c.tipo_contrato} · {fmtMoney(c.pago_por_hora)}/hr</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Monto (S/) <span className="text-red-500">*</span>
            </label>
            <input
              type="number" step="0.01" min="0"
              value={form.monto}
              onChange={(e) => setForm({ ...form, monto: e.target.value })}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-navy-500 focus:ring-2 focus:ring-navy-100 outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Período</label>
            <input
              type="text"
              value={form.periodo}
              onChange={(e) => setForm({ ...form, periodo: e.target.value })}
              placeholder={periodo}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-navy-500 focus:ring-2 focus:ring-navy-100 outline-none"
            />
          </div>
          <div className="md:col-span-2 flex items-center justify-end gap-2 pt-2">
            <button type="button" onClick={onCancel} className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 transition">
              Cancelar
            </button>
            <button
              type="submit"
              disabled={pagarMut.isPending}
              className="inline-flex items-center gap-2 rounded-lg bg-navy-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-navy-700 transition disabled:opacity-50"
            >
              <DollarSign className="h-4 w-4" />
              {pagarMut.isPending ? 'Procesando…' : 'Registrar pago a tutor'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

function TablaPagosPadres({ pagos, loading }) {
  if (loading) {
    return <div className="p-12 flex justify-center"><LoadingSpinner /></div>;
  }
  if (!pagos || pagos.length === 0) {
    return (
      <div className="p-12 text-center text-slate-500">
        <Receipt className="h-12 w-12 mx-auto text-slate-300 mb-3" />
        <p className="text-sm">Aún no se han registrado pagos de padres.</p>
      </div>
    );
  }

  const total = pagos.reduce((s, p) => s + Number(p.monto || 0), 0);

  return (
    <div className="overflow-x-auto">
      <div className="px-6 py-3 bg-navy-50/50 border-b border-slate-200 flex items-center justify-between">
        <span className="text-xs text-slate-600 font-medium">
          {pagos.length} {pagos.length === 1 ? 'pago' : 'pagos'} registrados
        </span>
        <span className="text-sm font-semibold text-navy-900">
          Total: {fmtMoney(total)}
        </span>
      </div>
      <table className="w-full text-sm text-left">
        <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
          <tr>
            <th className="px-6 py-3">#</th>
            <th className="px-6 py-3">Padre</th>
            <th className="px-6 py-3">Alumno</th>
            <th className="px-6 py-3">Monto</th>
            <th className="px-6 py-3">Fecha</th>
            <th className="px-6 py-3">Estado</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {pagos.map((p) => (
            <tr key={p.id} className="hover:bg-slate-50 transition">
              <td className="px-6 py-3 text-slate-500 font-mono text-xs">#{p.id}</td>
              <td className="px-6 py-3 font-medium text-slate-800">{p.padre || '-'}</td>
              <td className="px-6 py-3 text-slate-600">{p.alumno || '-'}</td>
              <td className="px-6 py-3 font-semibold text-emerald-700">{fmtMoney(p.monto)}</td>
              <td className="px-6 py-3 text-slate-600">{fmtDate(p.fecha_pago)}</td>
              <td className="px-6 py-3">
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

function TablaPagosTutores({ pagos, loading }) {
  if (loading) {
    return <div className="p-12 flex justify-center"><LoadingSpinner /></div>;
  }
  if (!pagos || pagos.length === 0) {
    return (
      <div className="p-12 text-center text-slate-500">
        <Wallet className="h-12 w-12 mx-auto text-slate-300 mb-3" />
        <p className="text-sm">No hay pagos a tutores aún.</p>
      </div>
    );
  }

  const total = pagos.reduce((s, p) => s + Number(p.monto || 0), 0);

  return (
    <div className="overflow-x-auto">
      <div className="px-6 py-3 bg-navy-50/50 border-b border-slate-200 flex items-center justify-between">
        <span className="text-xs text-slate-600 font-medium">
          {pagos.length} {pagos.length === 1 ? 'liquidación' : 'liquidaciones'}
        </span>
        <span className="text-sm font-semibold text-navy-900">
          Total: {fmtMoney(total)}
        </span>
      </div>
      <table className="w-full text-sm text-left">
        <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
          <tr>
            <th className="px-6 py-3">#</th>
            <th className="px-6 py-3">Tutor</th>
            <th className="px-6 py-3">Período</th>
            <th className="px-6 py-3">Monto</th>
            <th className="px-6 py-3">Fecha</th>
            <th className="px-6 py-3">Estado</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {pagos.map((p) => (
            <tr key={p.id} className="hover:bg-slate-50 transition">
              <td className="px-6 py-3 text-slate-500 font-mono text-xs">#{p.id}</td>
              <td className="px-6 py-3 font-medium text-slate-800">{p.tutor || `Tutor ${p.tutor_id}`}</td>
              <td className="px-6 py-3 text-slate-600">{p.periodo || '-'}</td>
              <td className="px-6 py-3 font-semibold text-navy-700">{fmtMoney(p.monto)}</td>
              <td className="px-6 py-3 text-slate-600">{fmtDate(p.fecha_pago)}</td>
              <td className="px-6 py-3">
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                  p.estado === 'PAGADO'
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-amber-100 text-amber-700'
                }`}>
                  {p.estado === 'PAGADO'
                    ? <CheckCircle2 className="h-3 w-3" />
                    : <AlertCircle className="h-3 w-3" />}
                  {p.estado || 'PENDIENTE'}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function TrabajadorPagosPage() {
  const [tab, setTab] = useState('padres');
  const [showForm, setShowForm] = useState(false);

  const { data: pagosPadres, isLoading: loadingPadres } = useQuery({
    queryKey: ['pagos-padres'],
    queryFn: listarPagosPadres,
  });
  const { data: pagosTutores, isLoading: loadingTutores } = useQuery({
    queryKey: ['pagos-tutores'],
    queryFn: listarPagosTutores,
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold text-navy-900">Pagos</h1>
            <p className="text-sm text-slate-600 mt-0.5">
              Registro y seguimiento de pagos de padres y liquidaciones a tutores.
            </p>
          </div>
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center gap-2 rounded-lg bg-navy-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-navy-700 transition"
            >
              <Plus className="h-4 w-4" />
              {tab === 'padres' ? 'Nuevo pago de padre' : 'Procesar pago a tutor'}
            </button>
          )}
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Ingresos padres</p>
                <p className="mt-1 text-xl font-bold text-emerald-700">
                  {fmtMoney((pagosPadres || []).reduce((s, p) => s + Number(p.monto || 0), 0))}
                </p>
              </div>
              <div className="rounded-lg bg-emerald-50 p-2.5">
                <DollarSign className="h-5 w-5 text-emerald-600" />
              </div>
            </div>
            <p className="mt-1 text-xs text-slate-500">{(pagosPadres || []).length} pagos</p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Egresos tutores</p>
                <p className="mt-1 text-xl font-bold text-navy-700">
                  {fmtMoney((pagosTutores || []).reduce((s, p) => s + Number(p.monto || 0), 0))}
                </p>
              </div>
              <div className="rounded-lg bg-navy-50 p-2.5">
                <Wallet className="h-5 w-5 text-navy-600" />
              </div>
            </div>
            <p className="mt-1 text-xs text-slate-500">{(pagosTutores || []).length} liquidaciones</p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Balance neto</p>
                <p className="mt-1 text-xl font-bold text-slate-900">
                  {fmtMoney(
                    (pagosPadres || []).reduce((s, p) => s + Number(p.monto || 0), 0) -
                    (pagosTutores || []).reduce((s, p) => s + Number(p.monto || 0), 0)
                  )}
                </p>
              </div>
              <div className="rounded-lg bg-amber-50 p-2.5">
                <Calculator className="h-5 w-5 text-amber-600" />
              </div>
            </div>
            <p className="mt-1 text-xs text-slate-500">Ingresos − Egresos</p>
          </div>
        </div>

        {showForm && (
          <>
            {tab === 'padres' ? (
              <FormRegistrarPagoPadre
                onSuccess={() => setShowForm(false)}
                onCancel={() => setShowForm(false)}
              />
            ) : (
              <FormGenerarOpagarTutor
                onSuccess={() => setShowForm(false)}
                onCancel={() => setShowForm(false)}
              />
            )}
          </>
        )}

        {/* Tabs */}
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="flex items-center gap-1 border-b border-slate-200 px-3">
            <TabButton
              active={tab === 'padres'}
              onClick={() => { setTab('padres'); setShowForm(false); }}
              icon={Users}
              count={(pagosPadres || []).length}
            >
              Pagos de padres
            </TabButton>
            <TabButton
              active={tab === 'tutores'}
              onClick={() => { setTab('tutores'); setShowForm(false); }}
              icon={Wallet}
              count={(pagosTutores || []).length}
            >
              Pagos a tutores
            </TabButton>
          </div>

          {tab === 'padres' ? (
            <TablaPagosPadres pagos={pagosPadres} loading={loadingPadres} />
          ) : (
            <TablaPagosTutores pagos={pagosTutores} loading={loadingTutores} />
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
