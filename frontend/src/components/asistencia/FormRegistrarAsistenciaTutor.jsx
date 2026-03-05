'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { registrarAsistenciaTutor, getMisMatriculasTutor } from '@/services/tutoresService';
import { toast } from 'sonner';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { MapPin, CheckCircle, AlertCircle } from 'lucide-react';

export const FormRegistrarAsistenciaTutor = () => {
    const [location, setLocation] = useState(null);
    const [locationError, setLocationError] = useState(null);
    const [matriculas, setMatriculas] = useState([]);
    const [loadingMatriculas, setLoadingMatriculas] = useState(true);

    const queryClient = useQueryClient();
    const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm();

    // 1. Obtener Matrículas Activas
    useEffect(() => {
        async function loadMatriculas() {
            try {
                const data = await getMisMatriculasTutor();
                setMatriculas(data);
                if (data.length > 0) {
                    setValue('matricula_id', data[0].id); // Preseleccionar primera
                }
            } catch (error) {
                toast.error('Error al cargar alumnos asignados');
            } finally {
                setLoadingMatriculas(false);
            }
        }
        loadMatriculas();
    }, [setValue]);

    // 2. Obtener Ubicación
    useEffect(() => {
        if (!navigator.geolocation) {
            setLocationError('Tu navegador no soporta geolocalización');
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                setLocation({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                });
                setValue('ubicacion_lat', position.coords.latitude);
                setValue('ubicacion_lng', position.coords.longitude);
            },
            (error) => {
                let msg = 'Error al obtener ubicación';
                if (error.code === 1) msg = 'Permiso de ubicación denegado. Actívalo para marcar asistencia.';
                setLocationError(msg);
            },
            { enableHighAccuracy: true }
        );
    }, [setValue]);

    // 3. Mutación para registrar
    const mutation = useMutation({
        mutationFn: registrarAsistenciaTutor,
        onSuccess: () => {
            toast.success('Asistencia registrada correctamente');
            reset(); // Resetea formulario
            window.location.reload(); // Recargar para ver en lista (opcional, mejor usar query invalidation)
        },
        onError: (error) => {
            toast.error(error.message || 'Error al registrar asistencia');
        }
    });

    const onSubmit = (data) => {
        if (!location) {
            toast.error('Se requiere tu ubicación para marcar asistencia.');
            return;
        }
        mutation.mutate({
            ...data,
            ubicacion_lat: location.lat,
            ubicacion_lng: location.lng,
            fecha: new Date().toISOString().split('T')[0], // Fecha actual
            hora_llegada_tutor: new Date().toLocaleTimeString('en-US', { hour12: false }) // Hora actual
        });
    };

    if (loadingMatriculas) return <LoadingSpinner />;

    if (matriculas.length === 0) {
        return (
            <div className="p-6 bg-yellow-50 border border-yellow-200 rounded-xl text-yellow-800">
                No tienes clases/alumnos asignados activos actualmente.
            </div>
        );
    }

    return (
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100 max-w-2xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
                <div className="bg-gold-100 p-3 rounded-xl">
                    <MapPin className="h-6 w-6 text-gold-600" />
                </div>
                <div>
                    <h3 className="text-xl font-bold text-navy-900">Registrar Mi Asistencia</h3>
                    <p className="text-sm text-slate-500">Asegúrate de estar en el domicilio del alumno antes de marcar.</p>
                </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Selección de Alumno/Clase */}
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                        Alumno / Curso
                    </label>
                    <select
                        {...register('matricula_id', { required: 'Selecciona una clase' })}
                        className="w-full rounded-lg border-slate-300 focus:border-navy-500 focus:ring-navy-500"
                    >
                        {matriculas.map((m) => (
                            <option key={m.id} value={m.id}>
                                {m.alumno} - {m.curso}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Estado de Ubicación */}
                <div className={`p-4 rounded-2xl text-sm flex items-start gap-3 border ${locationError ? 'bg-red-50 text-red-700 border-red-100' : 'bg-green-50 text-green-700 border-green-100'}`}>
                    {locationError ? (
                        <>
                            <AlertCircle className="h-6 w-6 shrink-0 text-red-500" />
                            <div>
                                <span className="font-bold block mb-0.5">Ubicación No Disponible</span>
                                <p className="text-xs opacity-90">{locationError}</p>
                            </div>
                        </>
                    ) : location ? (
                        <>
                            <CheckCircle className="h-6 w-6 shrink-0 text-green-500" />
                            <div>
                                <span className="font-bold block mb-0.5">Ubicación Verificada</span>
                                <div className="text-xs opacity-80 flex items-center gap-4">
                                    <span>Lat: {location.lat.toFixed(6)}</span>
                                    <span>Lng: {location.lng.toFixed(6)}</span>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex items-center gap-3 py-1">
                            <LoadingSpinner className="h-5 w-5 border-green-600" />
                            <span className="font-medium">Validando coordenadas GPS...</span>
                        </div>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={mutation.isPending || !location}
                    className="w-full py-4 px-6 bg-navy-600 hover:bg-navy-700 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white font-black rounded-2xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-3 transform active:scale-[0.98]"
                >
                    {mutation.isPending ? <LoadingSpinner title="Procesando registro..." /> : (
                        <>
                            <CheckCircle className="h-6 w-6" />
                            MARCAR ASISTENCIA AHORA
                        </>
                    )}
                </button>
            </form>
        </div>
    );
};
