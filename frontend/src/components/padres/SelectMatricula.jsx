'use client';

import { useMemo } from 'react';
import { useMisTutores } from '@/hooks/usePadres';
import { LoadingSpinner } from '@/components/LoadingSpinner';

/**
 * Componente select para elegir una matrícula activa (tutor asignado a un hijo)
 * Agrupa las matrículas por hijo y muestra tutor + curso
 * @param {Object} props
 * @param {string} props.alumnoId - ID del hijo seleccionado (filtra matrículas)
 * @param {string} props.value - Valor seleccionado (matricula_id)
 * @param {Function} props.onChange - Callback cuando cambia la selección
 * @param {boolean} props.required - Si el campo es requerido
 * @param {string} props.className - Clases CSS adicionales
 */
export function SelectMatricula({ alumnoId, value, onChange, required = false, className = '' }) {
  const { tutores, isLoading } = useMisTutores();

  // Filtrar tutores por alumno seleccionado
  // NOTA: El backend /api/padres/mis-tutores no devuelve matricula_id aún
  // Por ahora mostramos los tutores disponibles y el usuario ingresa matricula_id manualmente
  const tutoresDisponibles = useMemo(() => {
    if (!alumnoId || !tutores.length) return [];

    return tutores.filter((tutor) => tutor.alumno_id === Number(alumnoId));
  }, [tutores, alumnoId]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-2">
        <LoadingSpinner />
      </div>
    );
  }

  if (!alumnoId) {
    return (
      <select
        disabled
        className={`w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-400 ${className}`}
      >
        <option value="">Primero selecciona un hijo</option>
      </select>
    );
  }

  // Mostrar input para matricula_id (el backend aún no devuelve matricula_id en /api/padres/mis-tutores)
  return (
    <div className="space-y-1">
      <input
        type="number"
        min={1}
        value={value}
        onChange={onChange}
        placeholder="ID de la matrícula"
        required={required}
        className={`w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 ${className}`}
      />
      {tutoresDisponibles.length > 0 && (
        <p className="text-xs text-slate-500">
          Tutores asignados: {tutoresDisponibles.map((t) => `${t.nombres} ${t.apellidos}`).join(', ')}
        </p>
      )}
      <p className="text-xs text-slate-500">
        Ingresa el ID de la matrícula activa correspondiente a tu hijo y su tutor.
      </p>
    </div>
  );
}
