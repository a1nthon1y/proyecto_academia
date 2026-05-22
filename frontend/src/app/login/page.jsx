'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { toast } from 'sonner';
import { AlertCircle, Eye, EyeOff, LogIn, Mail, Lock, GraduationCap } from 'lucide-react';
import useStore from '@/store/useStore';

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({ correo: '', password: '', general: '' });
  const [formData, setFormData] = useState({ correo: '', password: '' });
  const [touched, setTouched] = useState({ correo: false, password: false });

  const { isAuthenticated, user, login } = useStore();

  useEffect(() => {
    if (isAuthenticated && user && user.rol_id) {
      const { getRouteByRolId } = require('@/utils/roles');
      router.replace(getRouteByRolId(user.rol_id));
    }
  }, [isAuthenticated, user, router]);

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
      const { getRouteByRolId } = require('@/utils/roles');
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

  // Validaciones locales suaves (no bloquean envío; solo guían)
  const correoVacio = touched.correo && !formData.correo.trim();
  const passwordVacio = touched.password && !formData.password.trim();

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-gradient-to-br from-navy-900 via-navy-800 to-navy-700 px-4 py-12 overflow-hidden">
      {/* Decoración: círculos dorados sutiles */}
      <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-gold-500/10 blur-3xl" aria-hidden />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-gold-400/10 blur-3xl" aria-hidden />

      <div className="relative w-full max-w-md space-y-6">
        {/* Encabezado con logo */}
        <div className="flex flex-col items-center text-center">
          <div className="rounded-2xl bg-white p-3 shadow-xl ring-1 ring-white/20">
            <Image
              src="/logo.png"
              alt="Deoxy Academia"
              width={72}
              height={72}
              className="rounded-xl"
              priority
            />
          </div>
          <h1 className="mt-5 text-3xl font-bold text-white tracking-tight">
            Deoxy <span className="text-gold-400">Academia</span>
          </h1>
          <p className="mt-1 text-sm text-navy-200">
            Sistema de gestión académica
          </p>
        </div>

        {/* Tarjeta de login */}
        <div className="rounded-2xl bg-white p-8 shadow-2xl ring-1 ring-black/5">
          <div className="mb-6 flex items-center gap-2 text-navy-900">
            <GraduationCap className="h-5 w-5 text-gold-500" />
            <h2 className="text-lg font-semibold">Bienvenido</h2>
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
            {/* Email / Usuario */}
            <div>
              <label
                htmlFor="correo"
                className="block text-sm font-medium text-slate-700 mb-1.5"
              >
                Correo electrónico o usuario <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  id="correo"
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
                <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.correo}
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
              <label
                htmlFor="password"
                className="block text-sm font-medium text-slate-700 mb-1.5"
              >
                Contraseña <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  id="password"
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
                <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.password}
                </p>
              ) : passwordVacio ? (
                <p className="mt-1 text-xs text-red-600">Ingresa tu contraseña</p>
              ) : null}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className={`mt-2 flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold text-white shadow-md transition ${
                isLoading
                  ? 'bg-navy-400 cursor-not-allowed'
                  : 'bg-navy-700 hover:bg-navy-800 active:scale-[0.99]'
              }`}
            >
              {isLoading ? (
                <>
                  <svg
                    className="h-4 w-4 animate-spin"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  Iniciando sesión...
                </>
              ) : (
                <>
                  <LogIn className="h-4 w-4" />
                  Iniciar sesión
                </>
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-navy-200">
          &copy; {new Date().getFullYear()} Deoxy Academia. Todos los derechos reservados.
        </p>
      </div>
    </div>
  );
}
