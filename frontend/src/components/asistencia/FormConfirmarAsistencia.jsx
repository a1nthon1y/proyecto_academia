'use client';

import { useState } from 'react';
import { useAsistenciasTutor } from '@/hooks/useAsistenciasTutor';
import { CheckCircleIcon } from '@heroicons/react/24/outline';

/**
 * Formulario para que el TUTOR confirme una asistencia marcada por el padre
 * Consume: POST /api/asistencias/tutor/:id/confirmar
 */
export function FormConfirmarAsistencia() {
  const [asistenciaId, setAsistenciaId] = useState('');
  const { confirmarAsistencia, isPending } = useAsistenciasTutor();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!asistenciaId) return;

    try {
      await confirmarAsistencia(Number(asistenciaId));
      setAsistenciaId(''); // Limpiar formulario después de éxito
    } catch (error) {
      // El error ya se maneja en el hook con toast
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md space-y-4 rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-100"
    >
      <div>
        <label className="block text-xs font-medium text-slate-700 mb-1">
          ID de la asistencia <span className="text-red-500">*</span>
        </label>
        <input
          type="number"
          min={1}
          value={asistenciaId}
          onChange={(e) => setAsistenciaId(e.target.value)}
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
          placeholder="Ej. 10"
          required
        />
        <p className="mt-1 text-xs text-slate-500">
          Ingresa el ID de la asistencia que quieres confirmar. Próximamente podrás seleccionar desde la lista de asistencias pendientes.
        </p>
      </div>

      <button
        type="submit"
        disabled={isPending || !asistenciaId}
        className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-700 disabled:cursor-not-allowed disabled:bg-primary-400"
      >
        <CheckCircleIcon className="h-4 w-4" />
        {isPending ? 'Confirmando asistencia...' : 'Confirmar asistencia'}
      </button>
    </form>
  );
}
