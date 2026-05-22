'use client';

import { AlertCircle } from 'lucide-react';

/**
 * Resumen visible de errores de validación en formularios.
 * Se muestra en la parte superior del form luego de un submit fallido.
 *
 * Props:
 *   - errors: react-hook-form formState.errors
 *   - fieldLabels: { fieldName: 'Label legible' } para traducir nombres técnicos
 */
export function FormErrorSummary({ errors, fieldLabels = {} }) {
  const entries = Object.entries(errors || {});
  if (entries.length === 0) return null;

  return (
    <div
      role="alert"
      className="rounded-lg border border-red-200 bg-red-50 p-4 animate-fadeIn"
    >
      <div className="flex items-start gap-3">
        <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="text-sm font-semibold text-red-800">
            {entries.length === 1
              ? 'Hay 1 campo con errores'
              : `Hay ${entries.length} campos con errores`}
          </p>
          <ul className="mt-2 space-y-1 text-sm text-red-700">
            {entries.map(([field, err]) => (
              <li key={field} className="flex items-start gap-1.5">
                <span className="text-red-400">•</span>
                <span>
                  <span className="font-medium">{fieldLabels[field] || field}:</span>{' '}
                  {err?.message || 'Campo inválido'}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
