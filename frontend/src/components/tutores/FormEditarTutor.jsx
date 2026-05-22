'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import { tutorSchema } from '@/schemas/personasSchemas';
import { useActualizarTutorCompleto } from '@/hooks/useTutoresMutations';
import { useUbicacion } from '@/hooks/useUbicacion';
import { useBancos } from '@/hooks/useBancos';
import { useNiveles } from '@/hooks/useNiveles';
import { obtenerTutor } from '@/services/tutoresServiceTrabajador';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { FormErrorSummary } from '@/components/shared/FormErrorSummary';
import { useScrollToError } from '@/hooks/useScrollToError';
import { User, Mail, Phone, MapPin, FileText, GraduationCap, DollarSign, MapPinned, Building2, Book, Save, X } from 'lucide-react';
import { z } from 'zod';

const FIELD_LABELS = {
    dni: 'DNI',
    nombres: 'Nombres',
    apellidos: 'Apellidos',
    email: 'Email',
    telefono: 'Teléfono',
    direccion: 'Dirección',
    especialidad: 'Especialidad',
    nivel_id: 'Nivel educativo',
    nivel_educativo_id: 'Nivel educativo',
    tarifa_por_sesion: 'Tarifa',
    ciudad_id: 'Ciudad',
    distrito_id: 'Distrito',
    banco_id: 'Banco',
    cuenta_bancaria: 'Cuenta bancaria',
};

// Esquema parcial para editar (sin password obligatorio y DNI opcional si no cambia)
const tutorEditSchema = tutorSchema.extend({
    password: z.string().optional(),
    dni: z.string().length(8, 'DNI debe tener 8 dígitos').optional(),
});

export function FormEditarTutor({ tutor, onSuccess, onCancel }) {
    const actualizarMutation = useActualizarTutorCompleto();
    const { ciudades, distritos, isLoadingCiudades, cargarDistritos } = useUbicacion();
    const { bancos, isLoadingBancos } = useBancos();
    const { niveles, isLoadingNiveles } = useNiveles();

    // La lista de tutores no devuelve TODOS los campos (ciudad_id, distrito_id,
    // banco_id, tarifa_por_sesion, cuenta_bancaria). Hacemos fetch fresco por ID
    // para asegurar que el form se pre-llena con datos completos.
    const { data: tutorCompleto, isLoading: isLoadingTutor } = useQuery({
        queryKey: ['tutor', tutor.id],
        queryFn: () => obtenerTutor(tutor.id),
        enabled: !!tutor.id,
    });

    const datos = tutorCompleto || tutor;

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        reset,
        formState: { errors, isSubmitting, isSubmitted },
    } = useForm({
        resolver: zodResolver(tutorEditSchema),
        mode: 'onBlur',
        reValidateMode: 'onChange',
        defaultValues: {
            dni: tutor.dni || '',
            nombres: tutor.nombres || '',
            apellidos: tutor.apellidos || '',
            email: tutor.email || '',
            telefono: tutor.telefono || '',
            direccion: '',
            especialidad: tutor.especialidad || '',
            nivel_educativo_id: '',
            tarifa_por_sesion: '',
            ciudad_id: '',
            distrito_id: '',
            banco_id: '',
            cuenta_bancaria: '',
        },
    });

    const ciudadId = watch('ciudad_id');

    useScrollToError(errors, isSubmitted);

    // Cuando llegan los datos completos del tutor, repoblamos el form.
    // Dependemos del ID (primitivo) para evitar loops si la referencia
    // del objeto cambia en cada fetch/refetch.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => {
        if (!tutorCompleto) return;

        reset({
            dni: tutorCompleto.dni || '',
            nombres: tutorCompleto.nombres || '',
            apellidos: tutorCompleto.apellidos || '',
            email: tutorCompleto.email || '',
            telefono: tutorCompleto.telefono || '',
            direccion: tutorCompleto.direccion || '',
            especialidad: tutorCompleto.especialidad || '',
            nivel_educativo_id: tutorCompleto.nivel_id?.toString() || '',
            tarifa_por_sesion: tutorCompleto.tarifa_por_sesion ?? '',
            ciudad_id: tutorCompleto.ciudad_id?.toString() || '',
            distrito_id: tutorCompleto.distrito_id?.toString() || '',
            banco_id: tutorCompleto.banco_id?.toString() || '',
            cuenta_bancaria: tutorCompleto.cuenta_bancaria || '',
        });

        if (tutorCompleto.ciudad_id) {
            cargarDistritos(tutorCompleto.ciudad_id);
        }
    }, [tutorCompleto?.id]);

    const onSubmit = async (data) => {
        try {
            const dataToSend = {
                dni: data.dni.trim(),
                nombres: data.nombres.trim(),
                apellidos: data.apellidos.trim(),
                email: data.email.trim(), // Si el backend permite actualizar email
                telefono: data.telefono.trim(),
                direccion: data.direccion.trim(),
            };

            if (data.especialidad?.trim()) dataToSend.especialidad = data.especialidad.trim();
            if (data.nivel_educativo_id) dataToSend.nivel_id = parseInt(data.nivel_educativo_id);
            if (data.tarifa_por_sesion) dataToSend.tarifa_por_sesion = parseFloat(data.tarifa_por_sesion);

            if (data.ciudad_id) dataToSend.ciudad_id = parseInt(data.ciudad_id);
            if (data.distrito_id) dataToSend.distrito_id = parseInt(data.distrito_id);

            if (data.banco_id) dataToSend.banco_id = parseInt(data.banco_id);
            if (data.cuenta_bancaria?.trim()) dataToSend.cuenta_bancaria = data.cuenta_bancaria.trim();

            await actualizarMutation.mutateAsync({ id: tutor.id, data: dataToSend });

            if (onSuccess) onSuccess();
        } catch (error) {
            console.error('Error al actualizar tutor:', error);
            if (error.message === 'DNI_ALREADY_EXISTS') {
                setError('dni', {
                    type: 'manual',
                    message: 'Este DNI ya está registrado por otro usuario'
                });
            }
        }
    };

    if (isLoadingTutor) {
        return (
            <div className="max-w-4xl space-y-6">
                <div className="flex items-center justify-between rounded-xl bg-slate-50 p-6 border border-slate-200">
                    <div>
                        <h2 className="text-xl font-bold text-navy-900">Editar Tutor</h2>
                        <p className="text-sm text-slate-600">Cargando datos del tutor…</p>
                    </div>
                </div>
                <div className="rounded-xl bg-white p-12 shadow-sm ring-1 ring-slate-200 flex justify-center">
                    <LoadingSpinner />
                </div>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="max-w-4xl space-y-6">
            <div className="flex items-center justify-between rounded-xl bg-slate-50 p-6 border border-slate-200">
                <div>
                    <h2 className="text-xl font-bold text-navy-900">Editar Tutor</h2>
                    <p className="text-sm text-slate-600">Actualizar información del docente</p>
                </div>
                {onCancel && (
                    <button
                        type="button"
                        onClick={onCancel}
                        className="rounded-full p-2 text-slate-400 hover:bg-slate-200 hover:text-slate-600 transition"
                    >
                        <X className="h-5 w-5" />
                    </button>
                )}
            </div>

            {/* Resumen de errores tras intento de submit */}
            {isSubmitted && Object.keys(errors).length > 0 && (
                <FormErrorSummary errors={errors} fieldLabels={FIELD_LABELS} />
            )}

            <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                {/* Datos Personales */}
                <div className="mb-6">
                    <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-slate-700">
                        <FileText className="h-4 w-4" />
                        Datos Personales
                    </h3>
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                            <label className="label">DNI <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                {...register('dni')}
                                maxLength={8}
                                inputMode="numeric"
                                className={errors.dni ? 'input input-error' : 'input'}
                                aria-invalid={!!errors.dni}
                            />
                            {errors.dni ? (
                                <p className="error-msg">{errors.dni.message}</p>
                            ) : (
                                <p className="hint">8 dígitos (Ej: 12345678)</p>
                            )}
                        </div>

                        <div>
                            <label className="label">Nombres <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                {...register('nombres')}
                                className={errors.nombres ? 'input input-error' : 'input'}
                                aria-invalid={!!errors.nombres}
                            />
                            {errors.nombres && <p className="error-msg">{errors.nombres.message}</p>}
                        </div>

                        <div className="sm:col-span-2">
                            <label className="label">Apellidos <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                {...register('apellidos')}
                                className={errors.apellidos ? 'input input-error' : 'input'}
                                aria-invalid={!!errors.apellidos}
                            />
                            {errors.apellidos && <p className="error-msg">{errors.apellidos.message}</p>}
                        </div>
                    </div>
                </div>

                {/* Contacto */}
                <div className="mb-6 border-t border-slate-200 pt-6">
                    <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-slate-700">
                        <Mail className="h-4 w-4" />
                        Contacto
                    </h3>
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                            <label className="label">Email</label>
                            <input type="email" {...register('email')} className="input" disabled />
                            <p className="hint">El email no se puede cambiar directamente.</p>
                        </div>
                        <div>
                            <label className="label">Teléfono <span className="text-red-500">*</span></label>
                            <input
                                type="tel"
                                {...register('telefono')}
                                inputMode="tel"
                                className={errors.telefono ? 'input input-error' : 'input'}
                                aria-invalid={!!errors.telefono}
                            />
                            {errors.telefono ? (
                                <p className="error-msg">{errors.telefono.message}</p>
                            ) : (
                                <p className="hint">Celular: 9 dígitos (Ej: 987654321)</p>
                            )}
                        </div>
                        <div className="sm:col-span-2">
                            <label className="label">Dirección <span className="text-red-500">*</span></label>
                            <textarea
                                {...register('direccion')}
                                rows={2}
                                className={errors.direccion ? 'input input-error' : 'input'}
                                aria-invalid={!!errors.direccion}
                            />
                            {errors.direccion ? (
                                <p className="error-msg">{errors.direccion.message}</p>
                            ) : (
                                <p className="hint">Mín. 10 caracteres (Ej: Av. Los Álamos 123, Cayma)</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Ubicación */}
                <div className="mb-6 border-t border-slate-200 pt-6">
                    <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-slate-700">
                        <MapPinned className="h-4 w-4" />
                        Ubicación
                    </h3>
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                            <label className="label">Ciudad</label>
                            <div className="relative">
                                <Building2 className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                                <select
                                    {...register('ciudad_id', {
                                        onChange: (e) => cargarDistritos(e.target.value)
                                    })}
                                    className="select pl-10"
                                    disabled={isLoadingCiudades}
                                >
                                    <option value="">Seleccione...</option>
                                    {ciudades.map((c) => (
                                        <option key={c.id} value={c.id}>{c.nombre}</option>
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
                                    className="select pl-10"
                                    disabled={!ciudadId}
                                >
                                    <option value="">Seleccione...</option>
                                    {distritos.map((d) => (
                                        <option key={d.id} value={d.id}>{d.nombre}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Info Profesional */}
                <div className="mb-6 border-t border-slate-200 pt-6">
                    <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-slate-700">
                        <GraduationCap className="h-4 w-4" /> Profesión
                    </h3>
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                            <label className="label">Especialidad</label>
                            <input type="text" {...register('especialidad')} className="input" />
                        </div>
                        <div>
                            <label className="label">Nivel Educativo</label>
                            <div className="relative">
                                <Book className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                                <select {...register('nivel_educativo_id')} className="select pl-10" disabled={isLoadingNiveles}>
                                    <option value="">Seleccione...</option>
                                    {niveles.map(n => <option key={n.id} value={n.id}>{n.nombre}</option>)}
                                </select>
                            </div>
                        </div>
                        <div>
                            <label className="label">Tarifa (S/.)</label>
                            <div className="relative">
                                <DollarSign className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                                <input
                                    type="number"
                                    step="0.01"
                                    {...register('tarifa_por_sesion')}
                                    className={errors.tarifa_por_sesion ? 'input input-error pl-10' : 'input pl-10'}
                                    aria-invalid={!!errors.tarifa_por_sesion}
                                />
                            </div>
                            {errors.tarifa_por_sesion ? (
                                <p className="error-msg">{errors.tarifa_por_sesion.message}</p>
                            ) : (
                                <p className="hint">Costo por sesión en soles (Ej: 25.50)</p>
                            )}
                        </div>
                    </div>
                </div>

            </div>

            <div className="flex gap-3 justify-end">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition"
                >
                    Cancelar
                </button>
                <button
                    type="submit"
                    disabled={isSubmitting || actualizarMutation.isPending}
                    className="px-6 py-2 bg-navy-600 text-white rounded-lg hover:bg-navy-700 transition flex items-center gap-2"
                >
                    {isSubmitting ? (
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    ) : (
                        <Save className="h-4 w-4" />
                    )}
                    Guardar Cambios
                </button>
            </div>

            <style jsx>{`
                .label { @apply block text-sm font-medium text-slate-700 mb-1.5; }
                .input { @apply w-full rounded-lg border border-slate-300 py-2.5 px-3 text-sm outline-none transition focus:border-navy-500 focus:ring-2 focus:ring-navy-100; }
                .input-error { @apply border-red-400 focus:border-red-500 focus:ring-red-100; }
                .select { @apply w-full rounded-lg border border-slate-300 py-2.5 px-3 text-sm outline-none transition focus:border-navy-500 focus:ring-2 focus:ring-navy-100; }
                .error-msg { @apply mt-1 text-xs text-red-600 flex items-center gap-1; }
                .hint { @apply mt-1 text-xs text-slate-400; }
            `}</style>
        </form>
    );
}
