'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { alumnoSchema } from '@/schemas/alumnosSchemas';
import { useCrearAlumno } from '@/hooks/useAlumnosMutations';
import { usePadres } from '@/hooks/usePadresTrabajador';
import { useUbicacion } from '@/hooks/useUbicacion';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { FormErrorSummary } from '@/components/shared/FormErrorSummary';
import { useScrollToError } from '@/hooks/useScrollToError';
import { User, Calendar, BookOpen, MapPinned, GraduationCap, Users, Building2 } from 'lucide-react';
import { toast } from 'sonner';

const FIELD_LABELS = {
  dni: 'DNI',
  nombres: 'Nombres',
  apellidos: 'Apellidos',
  fecha_nacimiento: 'Fecha de nacimiento',
  padre_id: 'Padre de familia',
  grado: 'Grado',
  nivel_id: 'Nivel educativo',
  ciudad_id: 'Ciudad',
  distrito_id: 'Distrito',
};

/**
 * Formulario para crear un alumno con validación completa y nuevo diseño
 */
export function FormCrearAlumno({ onSuccess }) {
  const { padres, isLoading: isLoadingPadres } = usePadres();
  const { ciudades, distritos, isLoadingCiudades, isLoadingDistritos, cargarDistritos } = useUbicacion();
  const crearAlumnoMutation = useCrearAlumno();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitted },
    reset,
    watch,
  } = useForm({
    resolver: zodResolver(alumnoSchema),
    mode: 'onBlur',
    reValidateMode: 'onChange',
    defaultValues: {
      dni: '',
      nombres: '',
      apellidos: '',
      fecha_nacimiento: '',
      padre_id: '',
      grado: '',
      nivel_id: '',
      ciudad_id: '',
      distrito_id: ''
    },
  });

  const ciudadId = watch('ciudad_id');

  useScrollToError(errors, isSubmitted);

  const onSubmit = async (data) => {
    try {
      await crearAlumnoMutation.mutateAsync({
        ...data,
        padre_id: parseInt(data.padre_id),
        nivel_id: data.nivel_id ? parseInt(data.nivel_id) : null,
        ciudad_id: data.ciudad_id ? parseInt(data.ciudad_id) : null,
        distrito_id: data.distrito_id ? parseInt(data.distrito_id) : null,
      });

      reset();
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Error al crear alumno:', error);
    }
  };

  if (isLoadingPadres || isLoadingCiudades) {
    return (
      <div className="flex h-40 items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="card max-w-4xl mx-auto">
      {/* Header */}
      <div className="gradient-navy -mx-6 -mt-6 mb-6 rounded-t-xl p-6 text-white">
        <h2 className="flex items-center gap-2 text-xl font-bold">
          <GraduationCap className="h-6 w-6 text-gold-400" />
          Registrar Nuevo Alumno
        </h2>
        <p className="mt-1 text-sm text-navy-100">
          Complete la información académica y personal del estudiante
        </p>
      </div>

      {/* Resumen de errores tras intento de submit */}
      {isSubmitted && Object.keys(errors).length > 0 && (
        <div className="mb-6">
          <FormErrorSummary errors={errors} fieldLabels={FIELD_LABELS} />
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Selección de Padre */}
        <div className="form-section">
          <h3 className="form-section-title">
            <Users className="h-4 w-4" />
            Apoderado Responsable
          </h3>

          <div className="relative">
            <label className="label">
              Padre de Familia <span className="text-red-500">*</span>
            </label>
            <select
              {...register('padre_id')}
              className={`input-field appearance-none ${errors.padre_id ? 'border-red-500' : ''}`}
            >
              <option value="">Seleccione un padre...</option>
              {padres?.map((padre) => (
                <option key={padre.id} value={padre.id}>
                  {padre.apellidos}, {padre.nombres} - {padre.dni}
                </option>
              ))}
            </select>
            {errors.padre_id && <p className="error-message">{errors.padre_id.message}</p>}
          </div>

          {padres?.length === 0 && (
            <div className="mt-2 rounded-lg bg-yellow-50 p-3 text-sm text-yellow-800 border border-yellow-200">
              ⚠️ No hay padres registrados. Primero debe registrar al apoderado en el módulo de Padres.
            </div>
          )}
        </div>

        {/* Datos del Alumno */}
        <div className="form-section">
          <h3 className="form-section-title">
            <User className="h-4 w-4" />
            Datos del Estudiante
          </h3>

          <div className="grid gap-6 sm:grid-cols-2">
            {/* DNI */}
            <div>
              <label className="label">DNI <span className="text-red-500">*</span></label>
              <input
                type="text"
                maxLength={8}
                {...register('dni')}
                className={`input-field ${errors.dni ? 'border-red-500' : ''}`}
                placeholder="12345678"
              />
              {errors.dni && <p className="error-message">{errors.dni.message}</p>}
            </div>

            {/* Fecha Nacimiento */}
            <div>
              <label className="label">Fecha de Nacimiento <span className="text-red-500">*</span></label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                <input
                  type="date"
                  {...register('fecha_nacimiento')}
                  className={`input-field pl-10 ${errors.fecha_nacimiento ? 'border-red-500' : ''}`}
                />
              </div>
              {errors.fecha_nacimiento && <p className="error-message">{errors.fecha_nacimiento.message}</p>}
            </div>

            {/* Nombres */}
            <div>
              <label className="label">Nombres <span className="text-red-500">*</span></label>
              <input
                type="text"
                {...register('nombres')}
                className={`input-field ${errors.nombres ? 'border-red-500' : ''}`}
                placeholder="Ej. Juan Gabriel"
              />
              {errors.nombres && <p className="error-message">{errors.nombres.message}</p>}
            </div>

            {/* Apellidos */}
            <div>
              <label className="label">Apellidos <span className="text-red-500">*</span></label>
              <input
                type="text"
                {...register('apellidos')}
                className={`input-field ${errors.apellidos ? 'border-red-500' : ''}`}
                placeholder="Ej. Pérez Lozano"
              />
              {errors.apellidos && <p className="error-message">{errors.apellidos.message}</p>}
            </div>
          </div>
        </div>

        {/* Información Académica y Ubicación */}
        <div className="form-section">
          <h3 className="form-section-title">
            <BookOpen className="h-4 w-4" />
            Información Académica y Ubicación
          </h3>

          <div className="grid gap-6 sm:grid-cols-2">
            {/* Grado */}
            <div>
              <label className="label">Grado/Año</label>
              <input
                type="text"
                {...register('grado')}
                className="input-field"
                placeholder="Ej. 5to Secundaria"
              />
            </div>

            {/* Nivel (Simulado - Idealmente sería de DB) */}
            <div>
              <label className="label">Nivel Educativo</label>
              <select {...register('nivel_id')} className="input-field">
                <option value="">Seleccione...</option>
                <option value="1">Primaria</option>
                <option value="2">Secundaria</option>
                <option value="3">Pre-Universitario</option>
              </select>
            </div>

            {/* Ciudad */}
            <div>
              <label className="label">Ciudad</label>
              <div className="relative">
                <Building2 className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                <select
                  {...register('ciudad_id', {
                    onChange: (e) => cargarDistritos(e.target.value)
                  })}
                  className="input-field pl-10 appearance-none"
                >
                  <option value="">Seleccione una ciudad...</option>
                  {ciudades.map((ciudad) => (
                    <option key={ciudad.id} value={ciudad.id}>{ciudad.nombre}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Distrito */}
            <div>
              <label className="label">Distrito</label>
              <div className="relative">
                <MapPinned className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                <select
                  {...register('distrito_id')}
                  className="input-field pl-10 appearance-none"
                  disabled={!ciudadId}
                >
                  <option value="">Seleccione un distrito...</option>
                  {distritos.map((distrito) => (
                    <option key={distrito.id} value={distrito.id}>{distrito.nombre}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={isSubmitting || padres?.length === 0}
            className="btn-primary min-w-[200px]"
          >
            {isSubmitting ? (
              <>
                <LoadingSpinner className="mr-2 h-4 w-4" />
                Registrando...
              </>
            ) : (
              'Registrar Alumno'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
