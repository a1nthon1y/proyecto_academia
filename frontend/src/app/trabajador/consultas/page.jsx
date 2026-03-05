'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';

export default function TrabajadorConsultasPage() {
  return (
    <DashboardLayout>
      <div className="space-y-4">
        <h1 className="text-2xl font-bold text-slate-900">
          Consultas y leads
        </h1>
        <p className="text-sm text-slate-600">
          Bandeja de entrada para gestionar las consultas recibidas desde la página pública y
          convertirlas en matrículas. Aquí se integrará el backend de consultas y seguimiento.
        </p>
      </div>
    </DashboardLayout>
  );
}

