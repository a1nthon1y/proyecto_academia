'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';

export default function TrabajadorPagosPage() {
  return (
    <DashboardLayout>
      <div className="space-y-4">
        <h1 className="text-2xl font-bold text-slate-900">
          Pagos
        </h1>
        <p className="text-sm text-slate-600">
          Registro y seguimiento de pagos de los padres de familia y liquidaciones a tutores.
          Más adelante conectaremos esta vista con los módulos de pagos del backend.
        </p>
      </div>
    </DashboardLayout>
  );
}

