
'use client';

import { useState } from 'react';
import { useCrearMatricula } from '@/hooks/useMatriculasMutations';
import { useAlumnos } from '@/hooks/useAlumnos';
import { useTutores } from '@/hooks/useTutoresTrabajador';
import { useCursos } from '@/hooks/useCursos';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { toast } from 'sonner';

/**
 * Formulario para crear una matrícula (Asignación Alumno - Tutor - Curso)
 */
export function FormCrearMatricula({ onSuccess }) {
  const { alumnos, isLoading: isLoadingAlumnos } = useAlumnos();
  const { tutores, isLoading: isLoadingTutores } = useTutores();
  const { cursos, isLoading: isLoadingCursos } = useCursos();
  const crearMatriculaMutation = useCrearMatricula();

  const [formData, setFormData] = useState({
    alumno_id: '',
    tutor_id: '',
    curso_id: '',
    direccion_clases: '',
    fecha_inicio: new Date().toISOString().split('T')[0], // Default hoy
    fecha_fin: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.alumno_id || !formData.curso_id) {
      toast.error('Complete Alumno y Curso para iniciar la matrícula');
      return;
    }

    try {
      await crearMatriculaMutation.mutateAsync({
        alumno_id: Number(formData.alumno_id),
        tutor_id: formData.tutor_id ? Number(formData.tutor_id) : null,
        curso_id: Number(formData.curso_id),
        direccion_clases: formData.direccion_clases || null,
        fecha_inicio: formData.fecha_inicio || null,
        fecha_fin: formData.fecha_fin || null,
      });

      // Limpiar formulario y reiniciar valores por defecto
      setFormData({
        alumno_id: '',
        tutor_id: '',
        curso_id: '',
        direccion_clases: '',
        fecha_inicio: new Date().toISOString().split('T')[0],
        fecha_fin: '',
      });

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      // El error ya se maneja en el hook con toast
    }
  };

  const isLoading = isLoadingAlumnos || isLoadingTutores || isLoadingCursos;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <LoadingSpinner />
      </div>
    );
  }

  // Filtrar solo alumnos activos (aunque el hook ya debería traerlos)
  // El backend validará si ya tienen matrícula activa, aquí solo listamos
  const alumnosDisponibles = alumnos || [];
  const tutoresDisponibles = tutores || [];
  const coursesDisponibles = cursos || [];

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-xl shadow-sm border border-slate-200">

      {/* 1. Selección de Actores */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Alumno */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Alumno <span className="text-red-500">*</span>
          </label>
          {alumnosDisponibles.length === 0 ? (
            <div className="p-2 text-sm text-yellow-700 bg-yellow-50 rounded-lg">No hay alumnos disponibles</div>
          ) : (
            <select
              value={formData.alumno_id}
              onChange={(e) => setFormData({ ...formData, alumno_id: e.target.value })}
              required
              className="w-full rounded-lg border-slate-300 focus:border-navy-500 focus:ring-navy-500"
            >
              <option value="">Selecciona un alumno</option>
              {alumnosDisponibles.map((alumno) => (
                <option key={alumno.id} value={alumno.id}>
                  {alumno.apellidos}, {alumno.nombres} {alumno.dni ? `(${alumno.dni})` : ''}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Tutor (Opcional) */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Tutor Asignado <span className="text-slate-400 font-normal">(Opcional)</span>
          </label>
          <select
            value={formData.tutor_id}
            onChange={(e) => setFormData({ ...formData, tutor_id: e.target.value })}
            className="w-full rounded-lg border-slate-300 focus:border-navy-500 focus:ring-navy-500"
          >
            <option value="">-- Sin asignar (Pendiente) --</option>
            {tutoresDisponibles.map((tutor) => (
              <option key={tutor.id} value={tutor.id}>
                {tutor.apellidos}, {tutor.nombres} - {tutor.especialidad || 'General'}
              </option>
            ))}
          </select>
          <p className="text-xs text-slate-500 mt-1">
            Puedes asignar un tutor más tarde si aún no está definido.
          </p>
        </div>
      </div>

      {/* 2. Detalles del Curso y Ubicación */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Curso */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Curso / Programa <span className="text-red-500">*</span>
          </label>
          {coursesDisponibles.length === 0 ? (
            <input
              type="number"
              placeholder="ID Curso (Backend pendiente)"
              value={formData.curso_id}
              onChange={(e) => setFormData({ ...formData, curso_id: e.target.value })}
              required
              className="w-full rounded-lg border-slate-300 focus:border-navy-500 focus:ring-navy-500"
            />
          ) : (
            <select
              value={formData.curso_id}
              onChange={(e) => setFormData({ ...formData, curso_id: e.target.value })}
              required
              className="w-full rounded-lg border-slate-300 focus:border-navy-500 focus:ring-navy-500"
            >
              <option value="">Selecciona un curso</option>
              {coursesDisponibles.map((curso) => (
                <option key={curso.id} value={curso.id}>
                  {curso.nombre} - S/. {parseFloat(curso.costo_mensual || 0).toFixed(2)}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Dirección */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Lugar de Clases
          </label>
          <input
            type="text"
            value={formData.direccion_clases}
            onChange={(e) => setFormData({ ...formData, direccion_clases: e.target.value })}
            placeholder="Ej. Av. Larco 123, Miraflores"
            className="w-full rounded-lg border-slate-300 focus:border-navy-500 focus:ring-navy-500"
          />
        </div>
      </div>

      {/* 3. Fechas */}
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Fecha Inicio
          </label>
          <input
            type="date"
            value={formData.fecha_inicio}
            onChange={(e) => setFormData({ ...formData, fecha_inicio: e.target.value })}
            className="w-full rounded-lg border-slate-300 focus:border-navy-500 focus:ring-navy-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Fecha Fin (Opcional)
          </label>
          <input
            type="date"
            value={formData.fecha_fin}
            onChange={(e) => setFormData({ ...formData, fecha_fin: e.target.value })}
            min={formData.fecha_inicio}
            className="w-full rounded-lg border-slate-300 focus:border-navy-500 focus:ring-navy-500"
          />
        </div>
      </div>

      {/* Botón de Acción */}
      <div className="pt-2">
        <button
          type="submit"
          disabled={crearMatriculaMutation.isPending}
          className="w-full md:w-auto px-6 py-2.5 bg-navy-600 text-white font-semibold rounded-lg shadow-sm hover:bg-navy-700 focus:ring-4 focus:ring-navy-200 transition disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {crearMatriculaMutation.isPending ? 'Procesando...' : 'Registrar Matrícula'}
        </button>
      </div>
    </form>
  );
}
