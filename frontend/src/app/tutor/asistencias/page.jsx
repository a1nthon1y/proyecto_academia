'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { FormConfirmarAsistencia } from '@/components/asistencia/FormConfirmarAsistencia';
import { FormRegistrarAsistenciaTutor } from '@/components/asistencia/FormRegistrarAsistenciaTutor';
import { ListaAsistenciasPendientesTutor } from '@/components/asistencia/ListaAsistenciasPendientesTutor'; // Si decidimos usarlo después
import { useMisAsistenciasTutor } from '@/hooks/useTutores'; // Hook opcional si queremos mostrar historial

/**
 * Página para que el TUTOR (rol_id = 4) marque su asistencia
 * Ruta: /tutor/asistencias
 */
export default function TutorAsistenciasPage() {

  return (
    <DashboardLayout>
      <div className="space-y-8">

        {/* Sección Principal: Marcar Asistencia */}
        <section>
          <div className="mb-4">
            <h1 className="text-2xl font-bold text-navy-900">
              Registrar Asistencia
            </h1>
            <p className="text-sm text-slate-600">
              Marca tu llegada a la sesión de clase. Se registrará tu ubicación actual.
            </p>
          </div>
          <div className="max-w-md">
            <FormRegistrarAsistenciaTutor />
          </div>
        </section>

        <hr className="border-slate-200" />

        {/* Sección Secundaria: Historial o Confirmaciones (Si aplica) */}
        {/* Por ahora lo dejamos limpio o mostramos historial reciente si se requiere */}

      </div>
    </DashboardLayout>
  );
}