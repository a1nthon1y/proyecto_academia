'use client';

import { useState, useEffect } from 'react';
import { useMatricula } from '@/hooks/useMatriculas';
import { useActualizarMatricula } from '@/hooks/useMatriculasMutations';
import { useTutores } from '@/hooks/useTutoresTrabajador';
import { useCursos } from '@/hooks/useCursos';
import { usePermissions } from '@/hooks/usePermissions';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { toast } from 'sonner';

/**
 * Formulario para editar matrícula existente
 * Solo ADMIN y TRABAJADOR pueden editar
 */
export function FormEditarMatricula({ matriculaId, onSuccess, onCancel }) {
    const { canEdit } = usePermissions();
    const { matricula, isLoading } = useMatricula(matriculaId);
    const { tutores } = useTutores();
    const { cursos } = useCursos();
    const actualizarMutation = useActualizarMatricula();

    const [formData, setFormData] = useState({
        tutor_id: '',
        curso_id: '',
        direccion_clases: '',
        fecha_fin: '',
    });

    useEffect(() => {
        if (matricula) {
            setFormData({
                tutor_id: matricula.tutor_id || '',
                curso_id: matricula.curso_id || '',
                direccion_clases: matricula.direccion_clases || '',
                fecha_fin: matricula.fecha_fin || '',
            });
        }
    }, [matricula]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!canEdit) {
            toast.error('No tienes permisos para editar matrículas');
            return;
        }

        try {
            await actualizarMutation.mutateAsync({
                id: matriculaId,
                data: {
                    tutor_id: Number(formData.tutor_id),
                    curso_id: Number(formData.curso_id),
                    direccion_clases: formData.direccion_clases || null,
                    fecha_fin: formData.fecha_fin || null,
                },
            });

            if (onSuccess) onSuccess();
        } catch (error) {
            // Error ya manejado por el hook
        }
    };

    if (!canEdit) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-sm text-red-700">
                    No tienes permisos para editar matrículas.
                </p>
            </div>
        );
    }

    if (isLoading || !matricula) {
        return (
            <div className="flex items-center justify-center py-8">
                <LoadingSpinner />
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 mb-4">
                <h3 className="text-sm font-semibold text-slate-700 mb-2">Información del Alumno</h3>
                <p className="text-sm text-slate-600">
                    <span className="font-medium">{matricula.alumno_nombre}</span> - DNI: {matricula.alumno_dni}
                </p>
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                    Tutor Asignado *
                </label>
                <select
                    value={formData.tutor_id}
                    onChange={(e) => setFormData({ ...formData, tutor_id: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                >
                    <option value="">Seleccione un tutor</option>
                    {tutores?.map((tutor) => (
                        <option key={tutor.id} value={tutor.id}>
                            {tutor.nombres} {tutor.apellidos} - {tutor.especialidad}
                        </option>
                    ))}
                </select>
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                    Curso *
                </label>
                <select
                    value={formData.curso_id}
                    onChange={(e) => setFormData({ ...formData, curso_id: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                >
                    <option value="">Seleccione un curso</option>
                    {cursos?.map((curso) => (
                        <option key={curso.id} value={curso.id}>
                            {curso.nombre} - S/. {parseFloat(curso.costo_mensual).toFixed(2)}/mes
                        </option>
                    ))}
                </select>
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                    Dirección de Clases
                </label>
                <textarea
                    value={formData.direccion_clases}
                    onChange={(e) => setFormData({ ...formData, direccion_clases: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows={3}
                    placeholder="Ingrese la dirección donde se realizarán las clases"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                    Fecha Fin
                </label>
                <input
                    type="date"
                    value={formData.fecha_fin}
                    onChange={(e) => setFormData({ ...formData, fecha_fin: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
            </div>

            <div className="flex gap-3 pt-4">
                <button
                    type="submit"
                    disabled={actualizarMutation.isPending}
                    className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {actualizarMutation.isPending ? 'Guardando...' : 'Guardar Cambios'}
                </button>
                {onCancel && (
                    <button
                        type="button"
                        onClick={onCancel}
                        className="flex-1 bg-slate-200 text-slate-700 px-4 py-2 rounded-lg hover:bg-slate-300 transition"
                    >
                        Cancelar
                    </button>
                )}
            </div>
        </form>
    );
}
