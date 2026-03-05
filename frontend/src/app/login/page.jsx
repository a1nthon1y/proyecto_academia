'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { toast } from 'sonner';
import { ExclamationCircleIcon } from '@heroicons/react/20/solid';
import useStore from '@/store/useStore';

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({
    correo: '',
    password: '',
    general: ''
  });
  const [formData, setFormData] = useState({
    correo: '',
    password: ''
  });

  const { isAuthenticated, user, login } = useStore();

  useEffect(() => {
    if (isAuthenticated && user && user.rol_id) {
      const { getRouteByRolId } = require('@/utils/roles');
      const path = getRouteByRolId(user.rol_id);
      router.replace(path);
    }
  }, [isAuthenticated, user, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({ correo: '', password: '', general: '' });
    
    try {
      const response = await login({
        // El backend acepta email o username en el campo "login"
        login: formData.correo,
        password: formData.password
      });
      
      toast.success(response.message || 'Inicio de sesión exitoso');
      const { getRouteByRolId } = require('@/utils/roles');
      const path = getRouteByRolId(response.user?.rol_id);
      router.replace(path);
    } catch (error) {
      // Manejar errores específicos
      if (error.message.includes('no encontrado')) {
        setErrors({ ...errors, correo: error.message });
      } else if (error.message.includes('Contraseña incorrecta')) {
        setErrors({ ...errors, password: error.message });
      } else if (error.message.includes('inactiva')) {
        setErrors({ ...errors, general: error.message });
      } else {
        setErrors({ ...errors, general: error.message || 'Error al iniciar sesión' });
      }

      toast.error(error.message, {
        duration: 4000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Si está cargando, mostrar un estado de carga
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-indigo-600 border-r-transparent"></div>
          <p className="mt-2 text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name } = e.target;
    setFormData({
      ...formData,
      [name]: e.target.value
    });
    // Limpiar error del campo cuando el usuario empiece a escribir
    setErrors({
      ...errors,
      [name]: '',
      general: ''
    });
  };

  return (
<div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 px-4 py-12 sm:px-6 lg:px-8">
  <div className="w-full max-w-md space-y-8">
    <div className="flex flex-col items-center">
      <Image
        src="/logo.png"
        alt="Deoxy Academia Logo"
        width={120}
        height={120}
        className="rounded-full shadow-md"
      />
      <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
        Bienvenido a Deoxy Academia
      </h2>
      <p className="mt-1 text-center text-sm text-gray-600">
        Ingresa tus credenciales para continuar
      </p>
    </div>

    <div className="rounded-xl bg-white p-8 shadow-lg">
      {errors.general && (
        <div className="mb-4 rounded-md border border-red-300 bg-red-50 p-4 text-sm text-red-700">
          <div className="flex items-center gap-2">
            <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
            <span>{errors.general}</span>
          </div>
        </div>
      )}

      <form className="space-y-6" onSubmit={handleSubmit}>
        {/* Correo */}
        <div>
          <label htmlFor="correo" className="block text-sm font-medium text-gray-700">
            Correo electrónico o usuario
          </label>
          <div className="relative mt-1">
            <input
              id="correo"
              name="correo"
              type="text"
              autoComplete="email"
              required
              value={formData.correo}
              onChange={handleChange}
              className={`block w-full rounded-md border px-3 py-2 shadow-sm sm:text-sm transition focus:outline-none ${
                errors.correo
                  ? 'border-red-500 text-red-900 placeholder-red-400 focus:border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
              }`}
              placeholder="ejemplo@correo.com"
            />
            {errors.correo && (
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
              </div>
            )}
          </div>
          {errors.correo && (
            <p className="mt-2 text-sm text-red-600">{errors.correo}</p>
          )}
        </div>

        {/* Contraseña */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Contraseña
          </label>
          <div className="relative mt-1">
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={formData.password}
              onChange={handleChange}
              className={`block w-full rounded-md border px-3 py-2 shadow-sm sm:text-sm transition focus:outline-none ${
                errors.password
                  ? 'border-red-500 text-red-900 placeholder-red-400 focus:border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
              }`}
              placeholder="********"
            />
            {errors.password && (
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
              </div>
            )}
          </div>
          {errors.password && (
            <p className="mt-2 text-sm text-red-600">{errors.password}</p>
          )}
        </div>

        {/* Botón */}
        <div>
          <button
            type="submit"
            disabled={isLoading}
            className={`flex w-full items-center justify-center rounded-md px-4 py-2 text-sm font-semibold text-white shadow-md transition duration-150 ease-in-out 
              ${isLoading 
                ? 'bg-indigo-400 cursor-not-allowed' 
                : 'bg-indigo-600 hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
              }`}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Iniciando...
              </>
            ) : (
              'Iniciar Sesión'
            )}
          </button>
        </div>
      </form>
    </div>
  </div>
</div>

  );
} 