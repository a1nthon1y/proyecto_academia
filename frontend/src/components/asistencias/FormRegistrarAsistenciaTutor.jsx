'use client';

import { useState, useEffect } from 'react';
import { useMatriculasTutor } from '@/hooks/useTutorData';
import { usePermissions } from '@/hooks/usePermissions';
import GeolocationService from '@/utils/geolocation';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { toast } from 'sonner';
import { MapPin, AlertCircle, CheckCircle2 } from 'lucide-react';

/**
 * Formulario para que el TUTOR registre asistencias
 * Captura ubicación GPS automáticamente
 */
export function FormRegistrarAsistenciaTutor({ onSuccess }) {
    const { matriculas, isLoading: matriculasLoading } = useMatriculasTutor();
    const { canRegisterAttendance, isTutor } = usePermissions();

    const [formData, setFormData] = useState({
        matricula_id: '',
        fecha: new Date().toISOString().split('T')[0],
        hora_llegada_tutor: new Date().toTimeString().slice(0, 5),
    });

    const [ubicacion, setUbicacion] = useState(null);
    const [ubicacionStatus, setUbicacionStatus] = useState('pending'); // 'pending', 'loading', 'success', 'error'
    const [ubicacionError, setUbicacionError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Verificar permisos de geolocalización al montar
    useEffect(() => {
        checkGeolocationPermission();
    }, []);

    const checkGeolocationPermission = async () => {
        if (!GeolocationService.isSupported()) {
            setUbicacionStatus('error');
            setUbicacionError('Tu navegador no soporta geolocalización');
            return;
        }

        try {
            const status = await GeolocationService.checkPermissionStatus();
            if (status === 'granted') {
                // Si ya tiene permisos, obtener ubicación automáticamente
                await obtenerUbicacion();
            }
        } catch (error) {
            console.error('Error al verificar permisos:', error);
        }
    };

    const obtenerUbicacion = async () => {
        setUbicacionStatus('loading');
        setUbicacionError('');

        try {
            const position = await GeolocationService.getCurrentPosition();
            setUbicacion(position);
            setUbicacionStatus('success');
            toast.success(`Ubicación capturada: ${position.lat.toFixed(6)}, ${position.lng.toFixed(6)}`);
        } catch (error) {
            setUbicacionStatus('error');
            setUbicacionError(error.message);
            toast.error(error.message);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!canRegisterAttendance) {
            toast.error('No tienes permisos para registrar asistencias');
            return;
        }

        if (!ubicacion) {
            toast.error('Debes activar tu ubicación para registrar asistencia');
            return;
        }

        setIsSubmitting(true);

        try {
            const { registrarAsistenciaTutor } = await import('@/services/asistenciasService');

            await registrarAsistenciaTutor({
                matriculaId: Number(formData.matricula_id),
                fecha: formData.fecha,
                horaLlegada: formData.hora_llegada_tutor,
                lat: ubicacion.lat,
                lng: ubicacion.lng,
            });

            toast.success('Asistencia registrada correctamente');

            // Limpiar formulario
            setFormData({
                matricula_id: '',
                fecha: new Date().toISOString().split('T')[0],
                hora_llegada_tutor: new Date().toTimeString().slice(0, 5),
            });

            // Solicitar nueva ubicación para próximo registro
            await obtenerUbicacion();

            if (onSuccess) onSuccess();
        } catch (error) {
            toast.error(error?.message || 'Error al registrar asistencia');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isTutor && !canRegisterAttendance) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-sm text-red-700">
                    Solo los tutores pueden registrar asistencias.
                </p>
            </div>
        );
    }

    if (matriculasLoading) {
        return (
            <div className="flex items-center justify-center py-8">
                <LoadingSpinner />
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Estado de Geolocalización */}
            <div className={`border rounded-lg p-4 ${ubicacionStatus === 'success' ? 'bg-green-50 border-green-200' :
                    ubicacionStatus === 'error' ? 'bg-red-50 border-red-200' :
                        ubicacionStatus === 'loading' ? 'bg-blue-50 border-blue-200' :
                            'bg-yellow-50 border-yellow-200'
                }`}>
                <div className="flex items-start gap-3">
                    {ubicacionStatus === 'loading' ? (
                        <LoadingSpinner size="sm" />
                    ) : ubicacionStatus === 'success' ? (
                        <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    ) : ubicacionStatus === 'error' ? (
                        <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                    ) : (
                        <MapPin className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                    )}

                    <div className="flex-1">
                        <h4 className="text-sm font-semibold mb-1">
                            {ubicacionStatus === 'loading' ? 'Obteniendo ubicación GPS...' :
                                ubicacionStatus === 'success' ? 'Ubicación capturada' :
                                    ubicacionStatus === 'error' ? 'Error de ubicación' :
                                        'Ubicación requerida'}
                        </h4>

                        {ubicacionStatus === 'success' && ubicacion && (
                            <div className="text-xs text-slate-600 space-y-1">
                                <p>Lat: {ubicacion.lat.toFixed(6)}, Lng: {ubicacion.lng.toFixed(6)}</p>
                                <p className="text-slate-500">Precisión: ±{ubicacion.accuracy?.toFixed(0)}m</p>
                            </div>
                        )}

                        {ubicacionStatus === 'error' && (
                            <p className="text-xs text-red-600 mb-2">{ubicacionError}</p>
                        )}

                        {ubicacionStatus === 'pending' && (
                            <p className="text-xs text-yellow-700 mb-2">
                                Activa tu ubicación para registrar asistencia
                            </p>
                        )}

                        {ubicacionStatus !== 'loading' && (
                            <button
                                type="button"
                                onClick={obtenerUbicacion}
                                className="text-xs bg-white px-3 py-1.5 rounded border border-slate-300 hover:bg-slate-50 transition mt-2"
                            >
                                {ubicacionStatus === 'success' ? 'Actualizar ubicación' : 'Activar ubicación'}
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Formulario */}
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                    Matrícula / Alumno *
                </label>
                <select
                    value={formData.matricula_id}
                    onChange={(e) => setFormData({ ...formData, matricula_id: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                >
                    <option value="">Seleccione un alumno</option>
                    {matriculas?.filter(m => m.estado === 'ACTIVO').map((matricula) => (
                        <option key={matricula.id} value={matricula.id}>
                            {matricula.alumno} - {matricula.curso}
                            {matricula.direccion_clases && ` (${matricula.direccion_clases})`}
                        </option>
                    ))}
                </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                        Fecha *
                    </label>
                    <input
                        type="date"
                        value={formData.fecha}
                        onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                        Hora de Llegada *
                    </label>
                    <input
                        type="time"
                        value={formData.hora_llegada_tutor}
                        onChange={(e) => setFormData({ ...formData, hora_llegada_tutor: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                    />
                </div>
            </div>

            <button
                type="submit"
                disabled={isSubmitting || !ubicacion}
                className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
                {isSubmitting ? 'Registrando...' : 'Registrar Asistencia'}
            </button>

            {!ubicacion && (
                <p className="text-xs text-center text-red-600">
                    Debes activar tu ubicación GPS antes de registrar la asistencia
                </p>
            )}
        </form>
    );
}
