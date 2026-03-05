'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { tutorSchema } from '@/schemas/personasSchemas';
import { useRegistrarTutorCompleto } from '@/hooks/useTutoresMutations';
import { useUbicacion } from '@/hooks/useUbicacion';
import { useBancos } from '@/hooks/useBancos';
import { useNiveles } from '@/hooks/useNiveles';
import { CredencialesDisplay } from '@/components/shared/CredencialesDisplay';
import { User, Mail, Phone, MapPin, Lock, Key, FileText, GraduationCap, DollarSign, MapPinned, Building2, Book } from 'lucide-react';

/**
 * Formulario para registrar un tutor
 * Validado con Zod y React Hook Form
 * Incluye selectores de Ubicación, Banco y Nivel Educativo
 */
export function FormCrearTutor({ onSuccess }) {
    const registrarMutation = useRegistrarTutorCompleto();
    const { ciudades, distritos, isLoadingCiudades, cargarDistritos } = useUbicacion();
    const { bancos, isLoadingBancos } = useBancos();
    const { niveles, isLoadingNiveles } = useNiveles();
    const [showCredenciales, setShowCredenciales] = useState(false);
    const [credencialesGeneradas, setCredencialesGeneradas] = useState(null);

    const {
        register,
        handleSubmit,
        watch,
        reset,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(tutorSchema),
        defaultValues: {
            dni: '',
            nombres: '',
            apellidos: '',
            email: '',
            telefono: '',
            direccion: '',
            especialidad: '',
            nivel_educativo_id: '',
            tarifa_por_sesion: '',
            ciudad_id: '',
            distrito_id: '',
            banco_id: '',
            cuenta_bancaria: '',
            password: '',
            useAutoPassword: true,
        },
    });

    const useAutoPassword = watch('useAutoPassword');
    const ciudadId = watch('ciudad_id');

    const onSubmit = async (data) => {
        try {
            const dataToSend = {
                tipo: 'TUTOR',
                dni: data.dni.trim(),
                nombres: data.nombres.trim(),
                apellidos: data.apellidos.trim(),
                email: data.email.trim(),
                telefono: data.telefono.trim(),
                direccion: data.direccion.trim(),
            };

            // Campos opcionales de tutor
            if (data.especialidad?.trim()) dataToSend.especialidad = data.especialidad.trim();
            if (data.nivel_educativo_id) dataToSend.nivel_id = parseInt(data.nivel_educativo_id);
            if (data.tarifa_por_sesion) dataToSend.tarifa_por_sesion = parseFloat(data.tarifa_por_sesion);

            // Ubicación
            if (data.ciudad_id) dataToSend.ciudad_id = parseInt(data.ciudad_id);
            if (data.distrito_id) dataToSend.distrito_id = parseInt(data.distrito_id);

            // Banco
            if (data.banco_id) dataToSend.banco_id = parseInt(data.banco_id);
            if (data.cuenta_bancaria?.trim()) dataToSend.cuenta_bancaria = data.cuenta_bancaria.trim();

            // Password personalizada
            if (!data.useAutoPassword && data.password?.trim()) {
                dataToSend.password = data.password.trim();
            }

            const result = await registrarMutation.mutateAsync(dataToSend);

            // IMPORTANTE: Si hay credenciales, NO llamar a onSuccess todavía
            // para que el componente no se desmonte al cambiar de vista
            if (result.credenciales) {
                setCredencialesGeneradas(result.credenciales);
                setShowCredenciales(true);
            } else if (onSuccess) {
                onSuccess(result);
            }

            // Limpiar formulario
            reset();
        } catch (error) {
            console.error('Error al registrar tutor:', error);

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
            <form onSubmit={handleSubmit(onSubmit)} className="max-w-4xl space-y-6">
                {/* Header */}
                <div className="rounded-xl bg-gradient-to-r from-navy-600 to-navy-700 p-6 text-white shadow-lg">
                    <h2 className="text-2xl font-bold">Registrar Tutor</h2>
                    <p className="mt-1 text-navy-100">
                        Complete la información personal y profesional del docente
                    </p>
                </div>

                {/* Form Card */}
                <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                    {/* Datos Personales */}
                    <div className="mb-6">
                        <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-slate-700">
                            <FileText className="h-4 w-4" />
                            Datos Personales
                        </h3>
                        <div className="grid gap-4 sm:grid-cols-2">
                            {/* DNI */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1.5">
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
                                            : 'border-slate-300 focus:border-navy-500 focus:ring-navy-100'
                                            } py-2.5 pl-10 pr-3 text-sm outline-none transition focus:ring-2`}
                                    />
                                </div>
                                {errors.dni && (
                                    <p className="mt-1 text-xs text-red-600">{errors.dni.message}</p>
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
                                        placeholder="Nombres Completos"
                                        className={`w-full rounded-lg border ${errors.nombres
                                            ? 'border-red-300 focus:border-red-500 focus:ring-red-100'
                                            : 'border-slate-300 focus:border-navy-500 focus:ring-navy-100'
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
                                        placeholder="Apellidos Completos"
                                        className={`w-full rounded-lg border ${errors.apellidos
                                            ? 'border-red-300 focus:border-red-500 focus:ring-red-100'
                                            : 'border-slate-300 focus:border-navy-500 focus:ring-navy-100'
                                            } py-2.5 pl-10 pr-3 text-sm outline-none transition focus:ring-2`}
                                    />
                                </div>
                                {errors.apellidos && (
                                    <p className="mt-1 text-xs text-red-600">{errors.apellidos.message}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Datos de Contacto */}
                    <div className="mb-6 border-t border-slate-200 pt-6">
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
                                        placeholder="correo@ejemplo.com"
                                        className={`w-full rounded-lg border ${errors.email
                                            ? 'border-red-300 focus:border-red-500 focus:ring-red-100'
                                            : 'border-slate-300 focus:border-navy-500 focus:ring-navy-100'
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
                                        placeholder="999 999 999"
                                        className={`w-full rounded-lg border ${errors.telefono
                                            ? 'border-red-300 focus:border-red-500 focus:ring-red-100'
                                            : 'border-slate-300 focus:border-navy-500 focus:ring-navy-100'
                                            } py-2.5 pl-10 pr-3 text-sm outline-none transition focus:ring-2`}
                                    />
                                </div>
                                {errors.telefono && (
                                    <p className="mt-1 text-xs text-red-600">{errors.telefono.message}</p>
                                )}
                            </div>

                            {/* Dirección */}
                            <div className="sm:col-span-2">
                                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                    Dirección <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <div className="pointer-events-none absolute top-3 left-3">
                                        <MapPin className="h-5 w-5 text-slate-400" />
                                    </div>
                                    <textarea
                                        {...register('direccion')}
                                        rows={2}
                                        placeholder="Dirección de domicilio"
                                        className={`w-full rounded-lg border ${errors.direccion
                                            ? 'border-red-300 focus:border-red-500 focus:ring-red-100'
                                            : 'border-slate-300 focus:border-navy-500 focus:ring-navy-100'
                                            } py-2.5 pl-10 pr-3 text-sm outline-none transition focus:ring-2`}
                                    />
                                </div>
                                {errors.direccion && (
                                    <p className="mt-1 text-xs text-red-600">{errors.direccion.message}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Ubicación Geográfica */}
                    <div className="mb-6 border-t border-slate-200 pt-6">
                        <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-slate-700">
                            <MapPinned className="h-4 w-4" />
                            Ubicación
                        </h3>
                        <div className="grid gap-4 sm:grid-cols-2">
                            {/* Ciudad */}
                            <div>
                                <label className="label">Ciudad</label>
                                <div className="relative">
                                    <Building2 className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                                    <select
                                        {...register('ciudad_id', {
                                            onChange: (e) => cargarDistritos(e.target.value)
                                        })}
                                        className="w-full rounded-lg border border-slate-300 py-2.5 pl-10 pr-3 text-sm outline-none transition focus:border-navy-500 focus:ring-2 focus:ring-navy-100"
                                        disabled={isLoadingCiudades}
                                    >
                                        <option value="">Seleccione una ciudad...</option>
                                        {ciudades.map((ciudad) => (
                                            <option key={ciudad.id} value={ciudad.id}>{ciudad.nombre}</option>
                                        ))}
                                    </select>
                                </div>
                                {errors.ciudad_id && (
                                    <p className="mt-1 text-xs text-red-600">{errors.ciudad_id.message}</p>
                                )}
                            </div>

                            {/* Distrito */}
                            <div>
                                <label className="label">Distrito</label>
                                <div className="relative">
                                    <MapPinned className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                                    <select
                                        {...register('distrito_id')}
                                        className="w-full rounded-lg border border-slate-300 py-2.5 pl-10 pr-3 text-sm outline-none transition focus:border-navy-500 focus:ring-2 focus:ring-navy-100"
                                        disabled={!ciudadId}
                                    >
                                        <option value="">Seleccione un distrito...</option>
                                        {distritos.map((distrito) => (
                                            <option key={distrito.id} value={distrito.id}>{distrito.nombre}</option>
                                        ))}
                                    </select>
                                </div>
                                {errors.distrito_id && (
                                    <p className="mt-1 text-xs text-red-600">{errors.distrito_id.message}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Información Profesional */}
                    <div className="mb-6 border-t border-slate-200 pt-6">
                        <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-slate-700">
                            <GraduationCap className="h-4 w-4" />
                            Información Profesional (Opcional)
                        </h3>
                        <div className="grid gap-4 sm:grid-cols-2">
                            {/* Especialidad */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                    Especialidad
                                </label>
                                <input
                                    type="text"
                                    {...register('especialidad')}
                                    placeholder="Ej: Matemáticas"
                                    className="w-full rounded-lg border border-slate-300 py-2.5 px-3 text-sm outline-none transition focus:border-navy-500 focus:ring-2 focus:ring-navy-100"
                                />
                                {errors.especialidad && (
                                    <p className="mt-1 text-xs text-red-600">{errors.especialidad.message}</p>
                                )}
                            </div>

                            {/* Nivel Educativo */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1.5">Nivel Educativo</label>
                                <div className="relative">
                                    <Book className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                                    <select
                                        {...register('nivel_id')}
                                        className="w-full rounded-lg border border-slate-300 py-2.5 pl-10 pr-3 text-sm outline-none transition focus:border-navy-500 focus:ring-2 focus:ring-navy-100"
                                        disabled={isLoadingNiveles}
                                    >
                                        <option value="">Seleccione un nivel...</option>
                                        {niveles.map((nivel) => (
                                            <option key={nivel.id} value={nivel.id}>{nivel.nombre}</option>
                                        ))}
                                    </select>
                                </div>
                                {errors.nivel_id && (
                                    <p className="mt-1 text-xs text-red-600">{errors.nivel_id.message}</p>
                                )}
                            </div>

                            {/* Tarifa por Sesión */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                    Tarifa por Sesión (S/.)
                                </label>
                                <div className="relative">
                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                        <DollarSign className="h-5 w-5 text-slate-400" />
                                    </div>
                                    <input
                                        type="number"
                                        step="0.01"
                                        {...register('tarifa_por_sesion')}
                                        placeholder="0.00"
                                        className={`w-full rounded-lg border ${errors.tarifa_por_sesion
                                            ? 'border-red-300 focus:border-red-500 focus:ring-red-100'
                                            : 'border-slate-300 focus:border-navy-500 focus:ring-navy-100'
                                            } py-2.5 pl-10 pr-3 text-sm outline-none transition focus:ring-2`}
                                    />
                                </div>
                                {errors.tarifa_por_sesion && (
                                    <p className="mt-1 text-xs text-red-600">{errors.tarifa_por_sesion.message}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Información Bancaria */}
                    <div className="mb-6 border-t border-slate-200 pt-6">
                        <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-slate-700">
                            <Building2 className="h-4 w-4 text-gold-500" />
                            Información Bancaria (Opcional)
                        </h3>
                        <div className="grid gap-4 sm:grid-cols-2">
                            {/* Banco Selector */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                    Banco
                                </label>
                                <select
                                    {...register('banco_id')}
                                    className="w-full rounded-lg border border-slate-300 py-2.5 px-3 text-sm outline-none transition focus:border-navy-500 focus:ring-2 focus:ring-navy-100"
                                    disabled={isLoadingBancos}
                                >
                                    <option value="">Seleccione un banco...</option>
                                    {bancos.map((banco) => (
                                        <option key={banco.id} value={banco.id}>
                                            {banco.nombre}
                                        </option>
                                    ))}
                                </select>
                                {errors.banco_id && (
                                    <p className="mt-1 text-xs text-red-600">{errors.banco_id.message}</p>
                                )}
                            </div>

                            {/* Cuenta Bancaria */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                    Cuenta Bancaria
                                </label>
                                <input
                                    type="text"
                                    {...register('cuenta_bancaria')}
                                    placeholder="N° de cuenta"
                                    className="w-full rounded-lg border border-slate-300 py-2.5 px-3 text-sm outline-none transition focus:border-navy-500 focus:ring-2 focus:ring-navy-100"
                                />
                                {errors.cuenta_bancaria && (
                                    <p className="mt-1 text-xs text-red-600">{errors.cuenta_bancaria.message}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Configuración de Contraseña */}
                    <div className="border-t border-slate-200 pt-6">
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
                                    className="mt-1 h-4 w-4 rounded border-slate-300 text-navy-600 focus:ring-2 focus:ring-navy-500"
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
                                            : 'border-slate-300 focus:border-navy-500 focus:ring-navy-100'
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
                        className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-navy-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-navy-600/30 transition hover:bg-navy-700 disabled:cursor-not-allowed disabled:bg-navy-400 disabled:shadow-none"
                    >
                        {isSubmitting || registrarMutation.isPending ? (
                            <>
                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                Registrando...
                            </>
                        ) : (
                            <>
                                <GraduationCap className="h-4 w-4" />
                                Registrar Tutor
                            </>
                        )}
                    </button>
                </div>
            </form>

            {/* Modal de Credenciales */}
            {showCredenciales && credencialesGeneradas && (
                <CredencialesDisplay
                    credenciales={credencialesGeneradas}
                    tipo="TUTOR"
                    onClose={() => {
                        setShowCredenciales(false);
                        if (onSuccess) onSuccess();
                    }}
                />
            )}
        </>
    );
}
