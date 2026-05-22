'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import { alumnoSchema } from '@/schemas/alumnosSchemas';
import { useActualizarAlumno } from '@/hooks/useAlumnosMutations';
import { useUbicacion } from '@/hooks/useUbicacion';
import { obtenerAlumno } from '@/services/alumnosService';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { FormErrorSummary } from '@/components/shared/FormErrorSummary';
import { useScrollToError } from '@/hooks/useScrollToError';
import { User, Calendar, BookOpen, MapPinned, GraduationCap, Building2, Save, X } from 'lucide-react';
import { useEffect } from 'react';

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

export function FormEditarAlumno({ alumno, onSuccess, onCancel }) {
    const { ciudades, distritos, isLoadingCiudades, cargarDistritos } = useUbicacion();
    const actualizarMutation = useActualizarAlumno();

    // La lista de alumnos no devuelve TODOS los campos (padre_id, ciudad_id,
    // distrito_id, nivel_id). Hacemos fetch fresco por ID.
    const { data: alumnoCompleto, isLoading: isLoadingAlumno } = useQuery({
        queryKey: ['alumno', alumno.id],
        queryFn: () => obtenerAlumno(alumno.id),
        enabled: !!alumno.id,
    });

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting, isSubmitted },
        watch,
        setValue,
        reset,
    } = useForm({
        resolver: zodResolver(alumnoSchema),
        mode: 'onBlur',
        reValidateMode: 'onChange',
        defaultValues: {
            dni: alumno.dni || '',
            nombres: alumno.nombres || '',
            apellidos: alumno.apellidos || '',
            fecha_nacimiento: alumno.fecha_nacimiento ? new Date(alumno.fecha_nacimiento).toISOString().split('T')[0] : '',
            padre_id: '',
            grado: alumno.grado || '',
            nivel_id: '',
            ciudad_id: '',
            distrito_id: '',
        },
    });

    const ciudadId = watch('ciudad_id');

    useScrollToError(errors, isSubmitted);

    // Cuando llega el alumno completo, repoblamos el form con todos los IDs.
    // Dependemos del ID (primitivo) para evitar loops infinitos.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => {
        if (!alumnoCompleto) return;

        reset({
            dni: alumnoCompleto.dni || '',
            nombres: alumnoCompleto.nombres || '',
            apellidos: alumnoCompleto.apellidos || '',
            fecha_nacimiento: alumnoCompleto.fecha_nacimiento
                ? new Date(alumnoCompleto.fecha_nacimiento).toISOString().split('T')[0]
                : '',
            padre_id: alumnoCompleto.padre_id?.toString() || '',
            grado: alumnoCompleto.grado || '',
            nivel_id: alumnoCompleto.nivel_id?.toString() || '',
            ciudad_id: alumnoCompleto.ciudad_id?.toString() || '',
            distrito_id: alumnoCompleto.distrito_id?.toString() || '',
        });

        if (alumnoCompleto.ciudad_id) {
            cargarDistritos(alumnoCompleto.ciudad_id);
        }
    }, [alumnoCompleto?.id]);

    const onSubmit = async (data) => {
        try {
            await actualizarMutation.mutateAsync({
                id: alumno.id,
                data: {
                    ...data,
                    padre_id: undefined, // No enviamos padre_id al actualizar (asumiendo que no cambia)
                    nivel_id: data.nivel_id ? parseInt(data.nivel_id) : null,
                    ciudad_id: data.ciudad_id ? parseInt(data.ciudad_id) : null,
                    distrito_id: data.distrito_id ? parseInt(data.distrito_id) : null,
                }
            });

            if (onSuccess) onSuccess();
        } catch (error) {
            console.error('Error al actualizar alumno:', error);
        }
    };

    if (isLoadingAlumno || isLoadingCiudades) {
        return (
            <div className="card max-w-4xl mx-auto">
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200">
                    <div>
                        <h2 className="flex items-center gap-2 text-xl font-bold text-navy-700">
                            <GraduationCap className="h-6 w-6 text-gold-400" />
                            Editar Alumno
                        </h2>
                        <p className="mt-1 text-sm text-slate-500">Cargando datos del estudiante…</p>
                    </div>
                </div>
                <div className="p-12 flex justify-center"><LoadingSpinner /></div>
            </div>
        );
    }

    return (
        <div className="card max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200">
                <div>
                    <h2 className="flex items-center gap-2 text-xl font-bold text-navy-700">
                        <GraduationCap className="h-6 w-6 text-gold-400" />
                        Editar Alumno
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">Actualizar información del estudiante</p>
                </div>
                {onCancel && (
                    <button onClick={onCancel} className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition">
                        <X className="h-5 w-5" />
                    </button>
                )}
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

                {/* Resumen de errores tras intento de submit */}
                {isSubmitted && Object.keys(errors).length > 0 && (
                    <FormErrorSummary errors={errors} fieldLabels={FIELD_LABELS} />
                )}

                {/* Datos Identificación */}
                <div className="form-section">
                    <h3 className="form-section-title">
                        <User className="h-4 w-4" />
                        Datos del Estudiante
                    </h3>

                    <div className="grid gap-6 sm:grid-cols-2">
                        <div>
                            <label className="label">DNI</label>
                            <input
                                type="text"
                                maxLength={8}
                                {...register('dni')}
                                className={errors.dni ? 'input-field border-red-400 focus:ring-red-100' : 'input-field'}
                                disabled
                            />
                            {errors.dni ? (
                                <p className="error-message">{errors.dni.message}</p>
                            ) : (
                                <p className="mt-1 text-xs text-slate-400">El DNI no se puede editar</p>
                            )}
                        </div>

                        <div>
                            <label className="label">Fecha de Nacimiento <span className="text-red-500">*</span></label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                                <input
                                    type="date"
                                    {...register('fecha_nacimiento')}
                                    className={errors.fecha_nacimiento ? 'input-field pl-10 border-red-400 focus:ring-red-100' : 'input-field pl-10'}
                                    aria-invalid={!!errors.fecha_nacimiento}
                                />
                            </div>
                            {errors.fecha_nacimiento && <p className="error-message">{errors.fecha_nacimiento.message}</p>}
                        </div>

                        <div>
                            <label className="label">Nombres <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                {...register('nombres')}
                                className={errors.nombres ? 'input-field border-red-400 focus:ring-red-100' : 'input-field'}
                                aria-invalid={!!errors.nombres}
                            />
                            {errors.nombres && <p className="error-message">{errors.nombres.message}</p>}
                        </div>

                        <div>
                            <label className="label">Apellidos <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                {...register('apellidos')}
                                className={errors.apellidos ? 'input-field border-red-400 focus:ring-red-100' : 'input-field'}
                                aria-invalid={!!errors.apellidos}
                            />
                            {errors.apellidos && <p className="error-message">{errors.apellidos.message}</p>}
                        </div>
                    </div>
                </div>

                {/* Info Académica y Ubicación */}
                <div className="form-section">
                    <h3 className="form-section-title">
                        <BookOpen className="h-4 w-4" />
                        Información Académica y Ubicación
                    </h3>

                    <div className="grid gap-6 sm:grid-cols-2">
                        <div>
                            <label className="label">Grado/Año</label>
                            <input type="text" {...register('grado')} className="input-field" />
                        </div>

                        <div>
                            <label className="label">Nivel Educativo</label>
                            <select {...register('nivel_id')} className="input-field">
                                <option value="">Seleccione...</option>
                                <option value="1">Primaria</option>
                                <option value="2">Secundaria</option>
                                <option value="3">Pre-Universitario</option>
                            </select>
                        </div>

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

                <div className="flex justify-end gap-3 pt-4">
                    {onCancel && (
                        <button type="button" onClick={onCancel} className="px-4 py-2 border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50 transition">
                            Cancelar
                        </button>
                    )}
                    <button
                        type="submit"
                        disabled={isSubmitting || actualizarMutation.isPending}
                        className="btn-primary min-w-[200px] flex items-center justify-center gap-2"
                    >
                        {isSubmitting || actualizarMutation.isPending ? (
                            <>
                                <LoadingSpinner className="h-4 w-4" />
                                Guardando...
                            </>
                        ) : (
                            <>
                                <Save className="h-4 w-4" />
                                Guardar Cambios
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
