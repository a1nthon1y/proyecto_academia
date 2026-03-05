'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';

export default function PadreHistorialPage() {
  return (
    <DashboardLayout>
      <div className="space-y-4">
        <h1 className="text-2xl font-bold text-slate-900">
          Historial de sesiones
        </h1>
        <p className="text-sm text-slate-600">
          Resumen de las sesiones realizadas por los tutores con tus hijos. Aquí
          mostraremos el historial de asistencias y comentarios una vez conectado
          al backend.
        </p>
      </div>
    </DashboardLayout>
  );
}