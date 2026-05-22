'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {
  AlertCircle,
  Eye,
  EyeOff,
  LogIn,
  Mail,
  Lock,
  GraduationCap,
  X,
} from 'lucide-react';
import useStore from '@/store/useStore';

/**
 * Modal de inicio de sesión que se monta sobre la página actual
 * sin requerir navegación a una ruta dedicada.
 *
 * Props:
 *   - open: boolean
 *   - onClose: () => void
 *   - closable?: boolean (default true). Si es false el usuario NO puede
 *     cerrar el modal (útil cuando la sesión expira y hay que reloguear).
 */
export function LoginModal({ open, onClose, closable = true }) {
  const router = useRouter();
  const { login } = useStore();

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({ correo: '', password: '', general: '' });
  const [formData, setFormData] = useState({ correo: '', password: '' });
  const [touched, setTouched] = useState({ correo: false, password: false });

  // Reset al cerrar
  useEffect(() => {
    if (!open) {
      setErrors({ correo: '', password: '', general: '' });
      setTouched({ correo: false, password: false });
      setShowPassword(false);
    }
  }, [open]);

  // ESC para cerrar (si closable)
  useEffect(() => {
    if (!open || !closable) return;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, closable, onClose]);

  // Bloquear scroll del body al abrir
  useEffect(() => {
    if (typeof document === 'undefined') return;
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  if (!open) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({ correo: '', password: '', general: '' });

    try {
      const response = await login({
        login: formData.correo,
        password: formData.password,
      });

      toast.success(response.message || 'Inicio de sesión exitoso');
      const { getRouteByRolId } = await import('@/utils/roles');
      router.replace(getRouteByRolId(response.user?.rol_id));
    } catch (error) {
      const msg = error.message || '';
      if (msg.includes('no encontrado')) {
        setErrors((p) => ({ ...p, correo: msg }));
      } else if (msg.includes('Contraseña incorrecta')) {
        setErrors((p) => ({ ...p, password: msg }));
      } else if (msg.includes('inactiva')) {
        setErrors((p) => ({ ...p, general: msg }));
      } else {
        setErrors((p) => ({ ...p, general: msg || 'Error al iniciar sesión' }));
      }
      toast.error(msg, { duration: 4000 });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
    setErrors((p) => ({ ...p, [name]: '', general: '' }));
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((p) => ({ ...p, [name]: true }));
  };

  const correoVacio = touched.correo && !formData.correo.trim();
  const passwordVacio = touched.password && !formData.password.trim();

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="login-modal-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-navy-900/90 via-navy-800/90 to-navy-700/90 backdrop-blur-md animate-fadeIn"
        onClick={closable ? onClose : undefined}
        aria-hidden="true"
      />

      {/* Halos dorados decorativos */}
      <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-gold-500/10 blur-3xl" aria-hidden />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-gold-400/10 blur-3xl" aria-hidden />

      {/* Card */}
      <div className="relative w-full max-w-md animate-fadeIn">
        {/* Botón cerrar */}
        {closable && (
          <button
            type="button"
            onClick={onClose}
            className="absolute -top-3 -right-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white text-slate-600 shadow-lg ring-1 ring-black/5 transition hover:bg-slate-100 hover:text-slate-900"
            aria-label="Cerrar"
          >
            <X className="h-5 w-5" />
          </button>
        )}

        {/* Encabezado con logo */}
        <div className="mb-5 flex flex-col items-center text-center">
          <div className="rounded-2xl bg-white p-2.5 shadow-xl ring-1 ring-white/20">
            <img
              src="/logo.png"
              alt="Deoxy Academia"
              width={56}
              height={56}
              className="h-14 w-14 rounded-xl object-contain"
            />
          </div>
          <h1
            id="login-modal-title"
            className="mt-4 text-2xl font-bold text-white tracking-tight"
          >
            Deoxy <span className="text-gold-400">Academia</span>
          </h1>
          <p className="mt-0.5 text-sm text-navy-200">Sistema de gestión académica</p>
        </div>

        {/* Card del form */}
        <div className="rounded-2xl bg-white p-6 sm:p-7 shadow-2xl ring-1 ring-black/5">
          <div className="mb-5 flex items-center gap-2 text-navy-900">
            <GraduationCap className="h-5 w-5 text-gold-500" />
            <h2 className="text-base font-semibold">Iniciar sesión</h2>
          </div>

          {errors.general && (
            <div
              role="alert"
              className="mb-4 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"
            >
              <AlertCircle className="h-5 w-5 flex-shrink-0 text-red-500" />
              <span>{errors.general}</span>
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit} noValidate>
            {/* Email / usuario */}
            <div>
              <label htmlFor="login-correo" className="mb-1.5 block text-sm font-medium text-slate-700">
                Correo o usuario <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  id="login-correo"
                  name="correo"
                  type="text"
                  autoComplete="username"
                  autoFocus
                  required
                  value={formData.correo}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="usuario o correo@dominio.com"
                  className={`w-full rounded-lg border py-2.5 pl-10 pr-3 text-sm outline-none transition focus:ring-2 ${
                    errors.correo || correoVacio
                      ? 'border-red-300 bg-red-50/50 focus:border-red-500 focus:ring-red-100'
                      : 'border-slate-300 focus:border-navy-500 focus:ring-navy-100'
                  }`}
                  aria-invalid={!!errors.correo}
                />
              </div>
              {errors.correo ? (
                <p className="mt-1 flex items-center gap-1 text-xs text-red-600">
                  <AlertCircle className="h-3 w-3" /> {errors.correo}
                </p>
              ) : correoVacio ? (
                <p className="mt-1 text-xs text-red-600">Ingresa tu correo o usuario</p>
              ) : (
                <p className="mt-1 text-xs text-slate-400">
                  Puedes usar tu correo o el nombre de usuario asignado
                </p>
              )}
            </div>

            {/* Contraseña */}
            <div>
              <label htmlFor="login-password" className="mb-1.5 block text-sm font-medium text-slate-700">
                Contraseña <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  id="login-password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="••••••••"
                  className={`w-full rounded-lg border py-2.5 pl-10 pr-10 text-sm outline-none transition focus:ring-2 ${
                    errors.password || passwordVacio
                      ? 'border-red-300 bg-red-50/50 focus:border-red-500 focus:ring-red-100'
                      : 'border-slate-300 focus:border-navy-500 focus:ring-navy-100'
                  }`}
                  aria-invalid={!!errors.password}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                  tabIndex={-1}
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password ? (
                <p className="mt-1 flex items-center gap-1 text-xs text-red-600">
                  <AlertCircle className="h-3 w-3" /> {errors.password}
                </p>
              ) : passwordVacio ? (
                <p className="mt-1 text-xs text-red-600">Ingresa tu contraseña</p>
              ) : null}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`mt-2 flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold text-white shadow-md transition ${
                isLoading
                  ? 'cursor-not-allowed bg-navy-400'
                  : 'bg-navy-700 hover:bg-navy-800 active:scale-[0.99]'
              }`}
            >
              {isLoading ? (
                <>
                  <svg className="h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Iniciando sesión...
                </>
              ) : (
                <>
                  <LogIn className="h-4 w-4" /> Iniciar sesión
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
