'use client';

import { useMisHijos } from '@/hooks/usePadres';
import { LoadingSpinner } from '@/components/LoadingSpinner';

/**
 * Componente select para elegir un hijo del padre autenticado
 * @param {Object} props
 * @param {string} props.value - Valor seleccionado (alumno_id)
 * @param {Function} props.onChange - Callback cuando cambia la selección
 * @param {boolean} props.required - Si el campo es requerido
 * @param {string} props.className - Clases CSS adicionales
 */
export function SelectHijo({ value, onChange, required = false, className = '' }) {
  const { hijos, isLoading } = useMisHijos();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-2">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <select
      value={value}
      onChange={onChange}
      required={required}
      className={`w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 ${className}`}
    >
      <option value="">Selecciona un hijo</option>
      {hijos.map((hijo) => (
        <option key={hijo.id} value={hijo.id}>
          {hijo.nombres} {hijo.apellidos}
          {hijo.fecha_nacimiento && ` (${new Date(hijo.fecha_nacimiento).getFullYear()})`}
        </option>
      ))}
    </select>
  );
}
