'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { padreSchema } from '@/schemas/personasSchemas';
import { useActualizarPadreCompleto } from '@/hooks/usePadresMutations';
import { FormErrorSummary } from '@/components/shared/FormErrorSummary';
import { useScrollToError } from '@/hooks/useScrollToError';
import { User, Mail, Phone, FileText, Save, X } from 'lucide-react';
import { z } from 'zod';

const FIELD_LABELS = {
    dni: 'DNI',
    nombres: 'Nombres',
    apellidos: 'Apellidos',
    email: 'Email',
    telefono: 'Teléfono',
};

// Esquema para editar (password y dni opcionales)
const padreEditSchema = padreSchema.extend({
    password: z.string().optional(),
    dni: z.string().length(8, 'DNI debe tener 8 dígitos').optional(),
});

export function FormEditarPadre({ padre, onSuccess, onCancel }) {
    const actualizarMutation = useActualizarPadreCompleto();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting, isSubmitted },
    } = useForm({
        resolver: zodResolver(padreEditSchema),
        mode: 'onBlur',
        reValidateMode: 'onChange',
        defaultValues: {
            dni: padre.dni || '',
            nombres: padre.nombres || '',
            apellidos: padre.apellidos || '',
            email: padre.email || '',
            telefono: padre.telefono || '',
        },
    });

    useScrollToError(errors, isSubmitted);

    const onSubmit = async (data) => {
        try {
            const dataToSend = {
                dni: data.dni.trim(),
                nombres: data.nombres.trim(),
                apellidos: data.apellidos.trim(),
                email: data.email.trim(),
                telefono: data.telefono.trim(),
            };

            await actualizarMutation.mutateAsync({ id: padre.id, data: dataToSend });

            if (onSuccess) onSuccess();
        } catch (error) {
            console.error('Error al actualizar padre:', error);
            if (error.message === 'DNI_ALREADY_EXISTS') {
                setError('dni', {
                    type: 'manual',
                    message: 'Este DNI ya está registrado por otro usuario'
                });
            }
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="max-w-3xl space-y-6">
            <div className="flex items-center justify-between rounded-xl bg-slate-50 p-6 border border-slate-200">
                <div>
                    <h2 className="text-xl font-bold text-navy-900">Editar Padre</h2>
                    <p className="text-sm text-slate-600">Actualizar información personal y contacto</p>
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
                .error-msg { @apply mt-1 text-xs text-red-600 flex items-center gap-1; }
                .hint { @apply mt-1 text-xs text-slate-400; }
            `}</style>
        </form>
    );
}
