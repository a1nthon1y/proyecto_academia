'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { alumnoSchema } from '@/schemas/alumnosSchemas';
import { useActualizarAlumno } from '@/hooks/useAlumnosMutations';
import { useUbicacion } from '@/hooks/useUbicacion';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { User, Calendar, BookOpen, MapPinned, GraduationCap, Building2, Save, X } from 'lucide-react';
import { useEffect } from 'react';

export function FormEditarAlumno({ alumno, onSuccess, onCancel }) {
    const { ciudades, distritos, isLoadingCiudades, cargarDistritos } = useUbicacion();
    const actualizarMutation = useActualizarAlumno();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        watch,
        setValue,
    } = useForm({
        resolver: zodResolver(alumnoSchema),
        defaultValues: {
            dni: alumno.dni || '',
            nombres: alumno.nombres || '',
            apellidos: alumno.apellidos || '',
            fecha_nacimiento: alumno.fecha_nacimiento ? new Date(alumno.fecha_nacimiento).toISOString().split('T')[0] : '',
            padre_id: alumno.padre_id?.toString() || '', // No editable visualmente pero necesario para validación si el schema lo requiere
            grado: alumno.grado || '',
            nivel_id: alumno.nivel_id?.toString() || '',
            ciudad_id: alumno.ciudad_id?.toString() || '',
            distrito_id: alumno.distrito_id?.toString() || ''
        },
    });

    const ciudadId = watch('ciudad_id');

    useEffect(() => {
        if (alumno.ciudad_id) {
            cargarDistritos(alumno.ciudad_id);
            setValue('distrito_id', alumno.distrito_id?.toString());
        }
    }, [alumno.ciudad_id]);

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

    if (isLoadingCiudades) {
        return <div className="p-8 flex justify-center"><LoadingSpinner /></div>;
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

                {/* Datos Identificación */}
                <div className="form-section">
                    <h3 className="form-section-title">
                        <User className="h-4 w-4" />
                        Datos del Estudiante
                    </h3>

                    <div className="grid gap-6 sm:grid-cols-2">
                        <div>
                            <label className="label">DNI</label>
                            <input type="text" maxLength={8} {...register('dni')} className="input-field" disabled={true} /> {/* DNI suele ser no editable o requiere permisos especiales */}
                            {errors.dni && <p className="error-message">{errors.dni.message}</p>}
                        </div>

                        <div>
                            <label className="label">Fecha de Nacimiento</label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                                <input type="date" {...register('fecha_nacimiento')} className="input-field pl-10" />
                            </div>
                            {errors.fecha_nacimiento && <p className="error-message">{errors.fecha_nacimiento.message}</p>}
                        </div>

                        <div>
                            <label className="label">Nombres</label>
                            <input type="text" {...register('nombres')} className="input-field" />
                            {errors.nombres && <p className="error-message">{errors.nombres.message}</p>}
                        </div>

                        <div>
                            <label className="label">Apellidos</label>
                            <input type="text" {...register('apellidos')} className="input-field" />
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
