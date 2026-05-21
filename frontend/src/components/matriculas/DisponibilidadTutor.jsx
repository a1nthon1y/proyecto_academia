'use client';

import { useQuery } from '@tanstack/react-query';
import { getDisponibilidadTutor } from '@/services/tutoresServiceTrabajador';
import { Clock, Users, AlertTriangle, CalendarDays, CheckCircle2 } from 'lucide-react';

const DIAS_CORTO = {
  LUNES:     'LUN',
  MARTES:    'MAR',
  MIERCOLES: 'MIÉ',
  JUEVES:    'JUE',
  VIERNES:   'VIE',
  SABADO:    'SÁB',
  DOMINGO:   'DOM',
};

const DIAS_ORDEN = ['LUNES','MARTES','MIERCOLES','JUEVES','VIERNES','SABADO','DOMINGO'];

function fmtHora(h) {
  return h ? h.slice(0, 5) : '?';
}

/**
 * Muestra la disponibilidad horaria semanal de un tutor y su carga actual.
 * Se usa inline en el formulario de matrícula al seleccionar un tutor.
 *
 * Props:
 *   tutorId  – id del tutor seleccionado (number | string)
 *   nombre   – nombre completo para el título (string, opcional)
 *   compact  – boolean: modo compacto para tarjetas (BuscadorTutores)
 */
export function DisponibilidadTutor({ tutorId, nombre, compact = false }) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['disponibilidad-tutor', tutorId],
    queryFn: () => getDisponibilidadTutor(tutorId),
    enabled: !!tutorId,
    staleTime: 30_000,
  });

  if (!tutorId) return null;

  if (isLoading) {
    return (
      <div className={`flex items-center gap-2 text-slate-500 text-xs ${compact ? '' : 'py-3'}`}>
        <div className="h-3 w-3 rounded-full border-2 border-slate-300 border-t-navy-500 animate-spin" />
        Cargando horario…
      </div>
    );
  }

  if (isError || !data) return null;

  const { disponibilidad, matriculas_activas } = data;

  // Agrupar bloques por día
  const porDia = DIAS_ORDEN.reduce((acc, dia) => {
    const bloques = disponibilidad.filter((b) => b.dia_semana === dia);
    if (bloques.length) acc[dia] = bloques;
    return acc;
  }, {});

  const diasConHorario = Object.keys(porDia);
  const sinHorario = diasConHorario.length === 0;

  // Modo compacto: sólo chips pequeños (para tarjetas de BuscadorTutores)
  if (compact) {
    return (
      <div className="mt-2 space-y-1">
        {sinHorario ? (
          <p className="text-[10px] text-slate-400 italic">Sin horario registrado</p>
        ) : (
          <div className="flex flex-wrap gap-1">
            {diasConHorario.map((dia) => (
              <div key={dia} className="flex items-center gap-0.5">
                <span className="text-[10px] font-bold text-navy-700 bg-navy-50 border border-navy-100 px-1.5 py-0.5 rounded">
                  {DIAS_CORTO[dia]}
                </span>
                {porDia[dia].map((b) => (
                  <span key={b.id} className="text-[10px] text-slate-500 bg-slate-50 border border-slate-200 px-1.5 py-0.5 rounded">
                    {fmtHora(b.hora_inicio)}–{fmtHora(b.hora_fin)}
                  </span>
                ))}
              </div>
            ))}
          </div>
        )}
        <div className="flex items-center gap-1 text-[10px] text-slate-500">
          <Users className="h-3 w-3" />
          {matriculas_activas} {matriculas_activas === 1 ? 'alumno activo' : 'alumnos activos'}
        </div>
      </div>
    );
  }

  // Modo completo: panel inline en el formulario
  const cargaColor =
    matriculas_activas === 0 ? 'emerald' :
    matriculas_activas <= 3 ? 'blue' :
    matriculas_activas <= 6 ? 'amber' : 'red';

  const cargaLabel =
    matriculas_activas === 0 ? 'Sin alumnos asignados' :
    matriculas_activas === 1 ? '1 alumno activo' :
    `${matriculas_activas} alumnos activos`;

  const CARGA_CLASSES = {
    emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    blue:    'bg-blue-50 text-blue-700 border-blue-200',
    amber:   'bg-amber-50 text-amber-700 border-amber-200',
    red:     'bg-red-50 text-red-700 border-red-200',
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-3 animate-fadeIn">
      {/* Encabezado */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <CalendarDays className="h-4 w-4 text-navy-600" />
          <span className="text-sm font-semibold text-navy-900">
            {nombre ? `Horario de ${nombre}` : 'Disponibilidad del tutor'}
          </span>
        </div>
        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${CARGA_CLASSES[cargaColor]}`}>
          <Users className="h-3 w-3" />
          {cargaLabel}
        </span>
      </div>

      {sinHorario ? (
        <div className="flex items-start gap-2 rounded-lg bg-amber-50 border border-amber-200 px-3 py-2.5 text-sm text-amber-700">
          <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
          <span>
            Este tutor <strong>no tiene horario registrado</strong>. Puedes asignarlo igualmente y
            coordinarlo después directamente con él.
          </span>
        </div>
      ) : (
        <>
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
            Horario semanal disponible
          </div>
          <div className="space-y-2">
            {diasConHorario.map((dia) => (
              <div key={dia} className="flex items-center gap-2 flex-wrap">
                <span className="w-10 text-xs font-bold text-navy-700 shrink-0">
                  {DIAS_CORTO[dia]}
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {porDia[dia].map((b) => (
                    <span
                      key={b.id}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-xs text-slate-700 font-medium shadow-sm"
                    >
                      <Clock className="h-3 w-3 text-slate-400" />
                      {fmtHora(b.hora_inicio)} – {fmtHora(b.hora_fin)}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {matriculas_activas >= 5 && (
            <div className="flex items-start gap-2 rounded-lg bg-amber-50 border border-amber-200 px-3 py-2 text-xs text-amber-700">
              <AlertTriangle className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" />
              <span>
                Este tutor tiene <strong>{matriculas_activas} alumnos activos</strong>. Verifica
                que tenga capacidad para uno más antes de asignarlo.
              </span>
            </div>
          )}
        </>
      )}
    </div>
  );
}
