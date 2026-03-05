'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';

export default function TrabajadorAsistenciasPage() {
  return (
    <DashboardLayout>
      <div className="space-y-4">
        <h1 className="text-2xl font-bold text-slate-900">
          Control de asistencias
        </h1>
        <p className="text-sm text-slate-600">
          Desde aquí el personal podrá gestionar y revisar las asistencias registradas por tutores
          y padres. Posteriormente se conectará con el backend de asistencias.
        </p>
      </div>
    </DashboardLayout>
  );
}