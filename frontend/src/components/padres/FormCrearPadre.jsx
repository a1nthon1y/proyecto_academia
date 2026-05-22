'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { padreSchema } from '@/schemas/personasSchemas';
import { useRegistrarPadreCompleto } from '@/hooks/usePadresMutations';
import { CredencialesDisplay } from '@/components/shared/CredencialesDisplay';
import { User, Mail, Phone, MapPin, Lock, Key, FileText, AtSign } from 'lucide-react';
import { previewUsername } from '@/utils/username';
import { FormErrorSummary } from '@/components/shared/FormErrorSummary';
import { useScrollToError } from '@/hooks/useScrollToError';

const FIELD_LABELS = {
  dni: 'DNI',
  nombres: 'Nombres',
  apellidos: 'Apellidos',
  email: 'Email',
  telefono: 'Teléfono',
  password: 'Contraseña',
};

/**
 * Formulario para registrar un padre de familia
 * Todos los campos son obligatorios según requisitos del negocio
 * Usa react-hook-form + Zod para validación
 */
export function FormCrearPadre({ onSuccess }) {
  const registrarMutation = useRegistrarPadreCompleto();
  const [showCredenciales, setShowCredenciales] = useState(false);
  const [credencialesGeneradas, setCredencialesGeneradas] = useState(null);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting, isSubmitted },
  } = useForm({
    resolver: zodResolver(padreSchema),
    mode: 'onBlur',
    reValidateMode: 'onChange',
    defaultValues: {
      dni: '',
      nombres: '',
      apellidos: '',
      email: '',
      telefono: '',
      password: '',
      useAutoPassword: true,
    },
  });

  const useAutoPassword = watch('useAutoPassword');
  const nombresWatch = watch('nombres');
  const apellidosWatch = watch('apellidos');
  const usernamePreview = previewUsername({
    nombres: nombresWatch,
    apellidos: apellidosWatch,
    rolId: 3, // PADRE
  });

  useScrollToError(errors, isSubmitted);

  const onSubmit = async (data) => {
    try {
      const dataToSend = {
        tipo: 'PADRE',
        dni: data.dni.trim(),
        nombres: data.nombres.trim(),
        apellidos: data.apellidos.trim(),
        email: data.email.trim(),
        telefono: data.telefono.trim(),

      };

      // Solo enviar password si no es automática y tiene valor
      if (!data.useAutoPassword && data.password?.trim()) {
        dataToSend.password = data.password.trim();
      }

      const result = await registrarMutation.mutateAsync(dataToSend);

      // IMPORTANTE: Si hay credenciales, NO llamar a onSuccess todavía
      // para que el modal no se desmonte al cambiar de vista en el padre
      if (result.credenciales) {
        setCredencialesGeneradas(result.credenciales);
        setShowCredenciales(true);
      } else if (onSuccess) {
        onSuccess(result);
      }

      // Limpiar formulario
      reset();
    } catch (error) {
      console.error('Error al registrar padre:', error);

      // Manejar errores específicos de duplicados
      if (error.message === 'EMAIL_ALREADY_EXISTS') {
        setError('email', {
          type: 'manual',
          message: 'Este correo electrónico ya está registrado'
        });
      } else if (error.message === 'DNI_ALREADY_EXISTS') {
        setError('dni', {
          type: 'manual',
          message: 'Este DNI ya está registrado'
        });
      }
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="max-w-3xl space-y-6">
        {/* Header */}
        <div className="gradient-navy rounded-xl p-6 text-white shadow-navy">
          <h2 className="text-2xl font-bold">Registrar Padre de Familia</h2>
          <p className="mt-1 text-navy-100">
            Complete todos los datos obligatorios para crear el usuario y perfil del padre
          </p>
        </div>

        {/* Resumen de errores tras intento de submit */}
        {isSubmitted && Object.keys(errors).length > 0 && (
          <FormErrorSummary errors={errors} fieldLabels={FIELD_LABELS} />
        )}

        {/* Form Card */}
        <div className="card">
          {/* Datos Personales */}
          <div className="form-section">
            <h3 className="form-section-title">
              <FileText className="h-4 w-4" />
              Datos Personales
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              {/* DNI */}
              <div>
                <label className="label">
                  DNI <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <FileText className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="text"
                    {...register('dni')}
                    maxLength={8}
                    placeholder="12345678"
                    className={`w-full rounded-lg border ${errors.dni
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-100'
                      : 'border-slate-300 focus:border-primary-500 focus:ring-primary-100'
                      } py-2.5 pl-10 pr-3 text-sm outline-none transition focus:ring-2`}
                  />
                </div>
                {errors.dni && (
                  <p className="error-message">{errors.dni.message}</p>
                )}
              </div>

              {/* Nombres */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Nombres <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <User className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="text"
                    {...register('nombres')}
                    placeholder="Juan Carlos"
                    className={`w-full rounded-lg border ${errors.nombres
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-100'
                      : 'border-slate-300 focus:border-primary-500 focus:ring-primary-100'
                      } py-2.5 pl-10 pr-3 text-sm outline-none transition focus:ring-2`}
                  />
                </div>
                {errors.nombres && (
                  <p className="mt-1 text-xs text-red-600">{errors.nombres.message}</p>
                )}
              </div>

              {/* Apellidos */}
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Apellidos <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <User className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="text"
                    {...register('apellidos')}
                    placeholder="Pérez García"
                    className={`w-full rounded-lg border ${errors.apellidos
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-100'
                      : 'border-slate-300 focus:border-primary-500 focus:ring-primary-100'
                      } py-2.5 pl-10 pr-3 text-sm outline-none transition focus:ring-2`}
                  />
                </div>
                {errors.apellidos && (
                  <p className="mt-1 text-xs text-red-600">{errors.apellidos.message}</p>
                )}
              </div>

              {/* Preview reactivo del username que generará el backend */}
              {usernamePreview && (
                <div className="sm:col-span-2 flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm">
                  <AtSign className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                  <span className="text-slate-600">
                    Usuario que se generará:{' '}
                    <span className="font-mono font-semibold text-emerald-700">
                      {usernamePreview}
                    </span>
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Datos de Contacto */}
          <div className="form-section">
            <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-slate-700">
              <Mail className="h-4 w-4" />
              Datos de Contacto
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Email <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Mail className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="email"
                    {...register('email')}
                    placeholder="padre@ejemplo.com"
                    className={`w-full rounded-lg border ${errors.email
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-100'
                      : 'border-slate-300 focus:border-primary-500 focus:ring-primary-100'
                      } py-2.5 pl-10 pr-3 text-sm outline-none transition focus:ring-2`}
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>
                )}
              </div>

              {/* Teléfono */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Teléfono <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Phone className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="tel"
                    {...register('telefono')}
                    placeholder="+51 999 999 999"
                    className={`w-full rounded-lg border ${errors.telefono
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-100'
                      : 'border-slate-300 focus:border-primary-500 focus:ring-primary-100'
                      } py-2.5 pl-10 pr-3 text-sm outline-none transition focus:ring-2`}
                  />
                </div>
                {errors.telefono && (
                  <p className="mt-1 text-xs text-red-600">{errors.telefono.message}</p>
                )}
              </div>


            </div>
          </div>

          {/* Configuración de Contraseña */}
          <div className="form-section">
            <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-slate-700">
              <Key className="h-4 w-4" />
              Configuración de Acceso
            </h3>

            {/* Toggle Auto Password */}
            <div className="mb-4 rounded-lg bg-slate-50 p-4">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  {...register('useAutoPassword')}
                  className="mt-1 h-4 w-4 rounded border-slate-300 text-primary-600 focus:ring-2 focus:ring-primary-500"
                />
                <div className="flex-1">
                  <span className="block text-sm font-medium text-slate-900">
                    Generar contraseña automáticamente
                  </span>
                  <span className="block text-xs text-slate-600 mt-0.5">
                    Se generará una contraseña segura de 8 caracteres que se mostrará al finalizar el registro
                  </span>
                </div>
              </label>
            </div>

            {/* Custom Password Field */}
            {!useAutoPassword && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Contraseña Personalizada <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Lock className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="password"
                    {...register('password')}
                    placeholder="Mínimo 6 caracteres"
                    className={`w-full rounded-lg border ${errors.password
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-100'
                      : 'border-slate-300 focus:border-primary-500 focus:ring-primary-100'
                      } py-2.5 pl-10 pr-3 text-sm outline-none transition focus:ring-2`}
                  />
                </div>
                {errors.password && (
                  <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={isSubmitting || registrarMutation.isPending}
            className="btn-primary flex-1 px-6 py-3"
          >
            {isSubmitting || registrarMutation.isPending ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Registrando...
              </>
            ) : (
              <>
                <User className="h-4 w-4" />
                Registrar Padre
              </>
            )}
          </button>
        </div>
      </form>

      {/* Modal de Credenciales */}
      {showCredenciales && credencialesGeneradas && (
        <CredencialesDisplay
          credenciales={credencialesGeneradas}
          tipo="PADRE"
          onClose={() => {
            setShowCredenciales(false);
            if (onSuccess) onSuccess();
          }}
        />
      )}
    </>
  );
}
