'use client';

import { useState, useMemo, useEffect } from 'react';
import { useUsers } from '@/hooks/useUsers';
import { createUser, updateUser, toggleUserStatus } from '@/services/userService';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import {
  Users, Plus, Search, X, Pencil, Eye, EyeOff,
  Lock, Mail, User as UserIcon, ShieldCheck, Briefcase,
  UserCheck, GraduationCap, CheckCircle, XCircle, AlertCircle,
} from 'lucide-react';
import Swal from 'sweetalert2';
import { toast } from 'sonner';

// ─────────────────────────────────────────────────────────────
// Constantes y helpers
// ─────────────────────────────────────────────────────────────

const ROLES_INFO = {
  1: { id: 1, nombre: 'ADMIN',      color: 'amber',   icon: ShieldCheck, prefijo: 'a' },
  2: { id: 2, nombre: 'TRABAJADOR', color: 'blue',    icon: Briefcase,   prefijo: 'w' },
  3: { id: 3, nombre: 'PADRE',      color: 'emerald', icon: UserCheck,   prefijo: 'p' },
  4: { id: 4, nombre: 'TUTOR',      color: 'purple',  icon: GraduationCap, prefijo: 't' },
};

const ROL_COLORS = {
  amber:   'bg-amber-100 text-amber-700 border-amber-200',
  blue:    'bg-blue-100 text-blue-700 border-blue-200',
  emerald: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  purple:  'bg-purple-100 text-purple-700 border-purple-200',
};

const limpiar = (txt) =>
  (txt || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '');

const previewUsername = ({ nombres, apellidos, rol_id }) => {
  if (!nombres || !apellidos || !rol_id) return '';
  const prefijo = ROLES_INFO[rol_id]?.prefijo;
  if (!prefijo) return '';
  const inicial = limpiar(nombres)[0] || '';
  const primerApellido = limpiar(apellidos.split(' ')[0]);
  return `${prefijo}${inicial}${primerApellido}`;
};

const fmtFecha = (d) =>
  d ? new Date(d).toLocaleDateString('es-PE', { day: '2-digit', month: 'long', year: 'numeric' }) : '-';

// ─────────────────────────────────────────────────────────────
// Componentes
// ─────────────────────────────────────────────────────────────

function BadgeRol({ rolId, rolNombre }) {
  const info = ROLES_INFO[rolId];
  if (!info) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
        {rolNombre || '?'}
      </span>
    );
  }
  const Icon = info.icon;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${ROL_COLORS[info.color]}`}>
      <Icon className="h-3 w-3" />
      {info.nombre}
    </span>
  );
}

function Modal({ open, onClose, title, children, footer }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-fadeIn">
        <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100 bg-gradient-to-r from-navy-50/50 to-transparent">
          <h2 className="text-base font-semibold text-navy-900">{title}</h2>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-slate-100 rounded-lg transition"
            aria-label="Cerrar"
          >
            <X className="h-4 w-4 text-slate-500" />
          </button>
        </div>
        <div className="px-5 py-4 max-h-[75vh] overflow-y-auto">{children}</div>
        {footer && (
          <div className="px-5 py-3 border-t border-slate-100 bg-slate-50/50 flex items-center justify-end gap-2">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

function UserForm({ initialValues, onSubmit, onCancel, isPending }) {
  const editing = !!initialValues;
  const [form, setForm] = useState({
    nombres: initialValues?.nombres || '',
    apellidos: initialValues?.apellidos || '',
    email: initialValues?.email || '',
    rol_id: initialValues?.rol_id || 2,
    username: initialValues?.username || '',
    password: '',
  });
  const [cambiarPassword, setCambiarPassword] = useState(false);
  const [verPassword, setVerPassword] = useState(false);
  const [error, setError] = useState('');

  const usernameAuto = previewUsername(form);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Validaciones
    if (!editing && (!form.nombres || !form.apellidos)) {
      setError('Los nombres y apellidos son obligatorios');
      return;
    }
    if (!form.email) {
      setError('El email es obligatorio');
      return;
    }
    if (!editing && !form.password) {
      setError('La contraseña es obligatoria');
      return;
    }
    if (!editing && form.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }
    if (editing && cambiarPassword && form.password.length < 6) {
      setError('La nueva contraseña debe tener al menos 6 caracteres');
      return;
    }

    const payload = {
      nombres: form.nombres || undefined,
      apellidos: form.apellidos || undefined,
      email: form.email,
      rol_id: form.rol_id,
      username: form.username || undefined,
    };
    if (!editing) {
      payload.password = form.password;
    } else if (cambiarPassword && form.password) {
      payload.password = form.password;
    }

    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="flex items-start gap-2 rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">
          <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
          {error}
        </div>
      )}

      {/* Nombres + Apellidos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">
            Nombres {!editing && <span className="text-red-500">*</span>}
          </label>
          <input
            type="text"
            value={form.nombres}
            onChange={(e) => setForm({ ...form, nombres: e.target.value })}
            placeholder="Juan Carlos"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-navy-500 focus:ring-2 focus:ring-navy-100 outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">
            Apellidos {!editing && <span className="text-red-500">*</span>}
          </label>
          <input
            type="text"
            value={form.apellidos}
            onChange={(e) => setForm({ ...form, apellidos: e.target.value })}
            placeholder="Pérez Gómez"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-navy-500 focus:ring-2 focus:ring-navy-100 outline-none"
          />
        </div>
      </div>

      {/* Email */}
      <div>
        <label className="block text-xs font-medium text-slate-700 mb-1">
          Email <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="usuario@ejemplo.com"
            className="w-full pl-9 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-navy-500 focus:ring-2 focus:ring-navy-100 outline-none"
            required
          />
        </div>
      </div>

      {/* Rol */}
      <div>
        <label className="block text-xs font-medium text-slate-700 mb-1">
          Rol del sistema <span className="text-red-500">*</span>
        </label>
        {editing ? (
          <div className="px-3 py-2 rounded-lg border border-slate-200 bg-slate-50">
            <BadgeRol rolId={form.rol_id} />
            <span className="ml-2 text-xs text-slate-500">No se puede cambiar el rol de un usuario existente</span>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            {[ROLES_INFO[1], ROLES_INFO[2]].map((r) => {
              const Icon = r.icon;
              const selected = form.rol_id === r.id;
              return (
                <button
                  type="button"
                  key={r.id}
                  onClick={() => setForm({ ...form, rol_id: r.id })}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border transition text-sm font-medium ${
                    selected
                      ? `${ROL_COLORS[r.color]} ring-2 ring-offset-1 ring-${r.color}-200`
                      : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {r.nombre}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Username */}
      <div>
        <label className="block text-xs font-medium text-slate-700 mb-1 flex items-center justify-between">
          <span>
            Nombre de usuario
            {!editing && <span className="ml-1 text-slate-400 font-normal">(opcional)</span>}
          </span>
        </label>
        <div className="relative">
          <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
          <input
            type="text"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            placeholder={usernameAuto || 'autogenerado'}
            className="w-full pl-9 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-navy-500 focus:ring-2 focus:ring-navy-100 outline-none"
          />
        </div>
        {!editing && !form.username && usernameAuto && (
          <p className="mt-1 text-xs text-slate-500">
            Se generará como <span className="font-semibold text-navy-700">{usernameAuto}</span>
          </p>
        )}
        {!editing && !form.username && !usernameAuto && (
          <p className="mt-1 text-xs text-slate-500">
            Si lo dejas vacío se generará automáticamente desde el nombre
          </p>
        )}
      </div>

      {/* Password */}
      {!editing ? (
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">
            Contraseña <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <input
              type={verPassword ? 'text' : 'password'}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="Mínimo 6 caracteres"
              className="w-full pl-9 pr-10 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-navy-500 focus:ring-2 focus:ring-navy-100 outline-none"
            />
            <button
              type="button"
              onClick={() => setVerPassword((v) => !v)}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-700"
            >
              {verPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>
      ) : (
        <div>
          <label className="inline-flex items-center gap-2 cursor-pointer text-sm text-slate-700">
            <input
              type="checkbox"
              checked={cambiarPassword}
              onChange={(e) => setCambiarPassword(e.target.checked)}
              className="rounded border-slate-300 text-navy-600 focus:ring-navy-500"
            />
            Cambiar contraseña
          </label>
          {cambiarPassword && (
            <div className="relative mt-2">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <input
                type={verPassword ? 'text' : 'password'}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="Nueva contraseña (mín. 6 caracteres)"
                className="w-full pl-9 pr-10 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-navy-500 focus:ring-2 focus:ring-navy-100 outline-none"
                autoFocus
              />
              <button
                type="button"
                onClick={() => setVerPassword((v) => !v)}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-700"
              >
                {verPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Botones */}
      <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 transition"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center gap-2 rounded-lg bg-navy-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-navy-700 transition disabled:opacity-50"
        >
          {isPending ? 'Guardando…' : (editing ? 'Guardar cambios' : 'Crear usuario')}
        </button>
      </div>
    </form>
  );
}

// ─────────────────────────────────────────────────────────────
// Componente principal
// ─────────────────────────────────────────────────────────────

export default function UserList() {
  const { data: allUsers, isLoading, refetch } = useUsers();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [search, setSearch] = useState('');
  const [filtroRol, setFiltroRol] = useState(null);
  const [filtroEstado, setFiltroEstado] = useState('todos'); // todos | activos | inactivos
  const [savingId, setSavingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Datos filtrados
  const filtered = useMemo(() => {
    let list = allUsers || [];
    if (filtroRol) list = list.filter((u) => u.rol_id === filtroRol);
    if (filtroEstado === 'activos') list = list.filter((u) => u.activo);
    if (filtroEstado === 'inactivos') list = list.filter((u) => !u.activo);
    if (search.trim()) {
      const s = search.trim().toLowerCase();
      list = list.filter((u) =>
        u.username?.toLowerCase().includes(s) ||
        u.email?.toLowerCase().includes(s) ||
        u.nombres?.toLowerCase().includes(s) ||
        u.apellidos?.toLowerCase().includes(s)
      );
    }
    return list;
  }, [allUsers, filtroRol, filtroEstado, search]);

  const stats = useMemo(() => {
    const list = allUsers || [];
    return {
      total: list.length,
      activos: list.filter((u) => u.activo).length,
      porRol: {
        1: list.filter((u) => u.rol_id === 1).length,
        2: list.filter((u) => u.rol_id === 2).length,
        3: list.filter((u) => u.rol_id === 3).length,
        4: list.filter((u) => u.rol_id === 4).length,
      },
    };
  }, [allUsers]);

  // Acciones
  const handleCreate = () => {
    setEditingUser(null);
    setModalOpen(true);
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setModalOpen(true);
  };

  const handleSubmit = async (values) => {
    setSubmitting(true);
    try {
      if (editingUser) {
        await updateUser(editingUser.id, values);
        toast.success('Usuario actualizado');
      } else {
        await createUser(values);
        toast.success('Usuario creado correctamente');
      }
      setModalOpen(false);
      setEditingUser(null);
      refetch();
    } catch (error) {
      toast.error(error.message || 'Error al procesar la solicitud');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggle = async (user) => {
    const willDisable = user.activo;

    if (willDisable && user.rol_id === 1) {
      const result = await Swal.fire({
        title: '¿Desactivar administrador?',
        html: `Estás por desactivar al administrador <b>${user.username}</b>.<br/>No podrá iniciar sesión.`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#dc2626',
        cancelButtonColor: '#64748b',
        confirmButtonText: 'Sí, desactivar',
        cancelButtonText: 'Cancelar',
      });
      if (!result.isConfirmed) return;
    }

    setSavingId(user.id);
    try {
      await toggleUserStatus(user.id, !user.activo);
      toast.success(`Usuario ${user.activo ? 'desactivado' : 'activado'}`);
      refetch();
    } catch (error) {
      toast.error(error.message || 'Error al cambiar el estado');
    } finally {
      setSavingId(null);
    }
  };

  const limpiarFiltros = () => {
    setSearch('');
    setFiltroRol(null);
    setFiltroEstado('todos');
  };

  const hayFiltros = search.trim() || filtroRol || filtroEstado !== 'todos';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-navy-900">Usuarios del sistema</h1>
          <p className="text-sm text-slate-600">
            Gestión de cuentas de acceso. Padres y tutores se crean desde sus módulos respectivos.
          </p>
        </div>
        <button
          onClick={handleCreate}
          className="flex items-center gap-2 rounded-lg bg-navy-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-navy-700 transition"
        >
          <Plus className="h-4 w-4" />
          Nuevo usuario
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <button
          onClick={() => { setFiltroRol(null); setFiltroEstado('todos'); }}
          className={`text-left rounded-xl border bg-white p-4 shadow-sm transition hover:shadow ${
            !filtroRol && filtroEstado === 'todos' ? 'border-navy-400 ring-2 ring-navy-100' : 'border-slate-200'
          }`}
        >
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Total</p>
          <p className="mt-1 text-2xl font-bold text-navy-900">{stats.total}</p>
        </button>
        <button
          onClick={() => setFiltroEstado(filtroEstado === 'activos' ? 'todos' : 'activos')}
          className={`text-left rounded-xl border bg-white p-4 shadow-sm transition hover:shadow ${
            filtroEstado === 'activos' ? 'border-emerald-400 ring-2 ring-emerald-100' : 'border-slate-200'
          }`}
        >
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Activos</p>
          <p className="mt-1 text-2xl font-bold text-emerald-700">{stats.activos}</p>
        </button>
        {[1, 2, 3, 4].map((rolId) => {
          const info = ROLES_INFO[rolId];
          const Icon = info.icon;
          const selected = filtroRol === rolId;
          return (
            <button
              key={rolId}
              onClick={() => setFiltroRol(selected ? null : rolId)}
              className={`text-left rounded-xl border bg-white p-4 shadow-sm transition hover:shadow ${
                selected ? `border-${info.color}-400 ring-2 ring-${info.color}-100` : 'border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">{info.nombre}</p>
                <Icon className={`h-4 w-4 ${
                  info.color === 'amber'   ? 'text-amber-500' :
                  info.color === 'blue'    ? 'text-blue-500' :
                  info.color === 'emerald' ? 'text-emerald-500' : 'text-purple-500'
                }`} />
              </div>
              <p className="mt-1 text-2xl font-bold text-navy-900">{stats.porRol[rolId]}</p>
            </button>
          );
        })}
      </div>

      {/* Tabla */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-slate-500" />
            <span className="text-sm font-medium text-slate-700">
              {filtered.length} de {stats.total} usuarios
            </span>
            {hayFiltros && (
              <button
                onClick={limpiarFiltros}
                className="ml-2 inline-flex items-center gap-1 text-xs text-navy-600 hover:underline"
              >
                <X className="h-3 w-3" /> Limpiar filtros
              </button>
            )}
          </div>
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <input
              type="search"
              placeholder="Buscar por nombre, usuario o email…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-72 pl-8 pr-3 py-1.5 text-sm rounded-lg border border-slate-300 focus:border-navy-500 focus:ring-2 focus:ring-navy-100 outline-none"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="p-12 flex justify-center"><LoadingSpinner /></div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <Users className="h-12 w-12 mx-auto text-slate-300 mb-3" />
            <p className="text-sm">
              {stats.total === 0
                ? 'No hay usuarios registrados.'
                : 'No se encontraron usuarios con esos filtros.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">Usuario</th>
                  <th className="px-4 py-3 hidden md:table-cell">Email</th>
                  <th className="px-4 py-3">Rol</th>
                  <th className="px-4 py-3">Estado</th>
                  <th className="px-4 py-3 hidden lg:table-cell">Creado</th>
                  <th className="px-4 py-3 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((user) => {
                  const nombreCompleto = `${user.nombres || ''} ${user.apellidos || ''}`.trim();
                  return (
                    <tr key={user.id} className="hover:bg-slate-50 transition">
                      <td className="px-4 py-3">
                        <div className="font-medium text-navy-900">
                          {nombreCompleto || <span className="text-slate-400 italic">(sin nombre)</span>}
                        </div>
                        <div className="text-xs text-slate-500 font-mono">@{user.username}</div>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell text-slate-600 break-all">{user.email}</td>
                      <td className="px-4 py-3">
                        <BadgeRol rolId={user.rol_id} rolNombre={user.rol} />
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => handleToggle(user)}
                          disabled={savingId === user.id}
                          title={user.activo ? 'Click para desactivar' : 'Click para activar'}
                          className={`relative inline-flex items-center h-6 w-11 rounded-full transition disabled:opacity-50 ${
                            user.activo ? 'bg-emerald-500' : 'bg-slate-300'
                          }`}
                        >
                          <span
                            className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                              user.activo ? 'translate-x-5' : 'translate-x-0'
                            }`}
                          />
                        </button>
                        <span className="ml-2 text-xs text-slate-500">
                          {user.activo ? (
                            <span className="inline-flex items-center gap-1 text-emerald-600">
                              <CheckCircle className="h-3 w-3" /> Activo
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-slate-500">
                              <XCircle className="h-3 w-3" /> Inactivo
                            </span>
                          )}
                        </span>
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell text-xs text-slate-500">{fmtFecha(user.creado_en)}</td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => handleEdit(user)}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-navy-50 text-navy-700 hover:bg-navy-100 transition"
                        >
                          <Pencil className="h-3 w-3" />
                          Editar
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditingUser(null); }}
        title={editingUser ? `Editar usuario · #${editingUser.id}` : 'Nuevo usuario'}
      >
        <UserForm
          initialValues={editingUser}
          isPending={submitting}
          onSubmit={handleSubmit}
          onCancel={() => { setModalOpen(false); setEditingUser(null); }}
        />
      </Modal>
    </div>
  );
}
