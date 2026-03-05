'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { getMisMatriculasTutor, getPerfilTutor } from '@/services/tutoresService';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import {
  UserGroupIcon,
  AcademicCapIcon,
  MapPinIcon,
  CheckCircleIcon,
  ClockIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';

export default function TutorDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [matriculas, setMatriculas] = useState([]);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const [profileData, matriculasData] = await Promise.all([
          getPerfilTutor(),
          getMisMatriculasTutor()
        ]);
        setProfile(profileData);
        setMatriculas(matriculasData);
      } catch (error) {
        console.error('Error loading tutor dashboard:', error);
      } finally {
        setLoading(false);
      }
    }
    loadDashboardData();
  }, []);

  if (loading) return (
    <DashboardLayout>
      <div className="flex h-64 items-center justify-center">
        <LoadingSpinner title="Cargando tu panel..." />
      </div>
    </DashboardLayout>
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header de Bienvenida */}
        <div className="bg-gradient-to-r from-navy-900 to-navy-700 rounded-2xl p-8 text-white shadow-lg">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">¡Hola, {profile?.nombres}! 👋</h1>
              <p className="text-navy-100 flex items-center gap-2">
                <AcademicCapIcon className="h-5 w-5" />
                {profile?.especialidad || 'Tutor Académico'} • {profile?.nivel || 'Nivel General'}
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
              <div className="text-navy-100 text-xs uppercase tracking-wider font-bold mb-1">Fecha de Hoy</div>
              <div className="text-xl font-bold flex items-center gap-2">
                <CalendarIcon className="h-6 w-6 text-gold-400" />
                {new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long' })}
              </div>
            </div>
          </div>
        </div>

        {/* Grid de Contenido */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Columna Izquierda: Sesiones del Día / Matriculas Activas */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                <h2 className="text-xl font-bold text-navy-900 flex items-center gap-2">
                  <ClockIcon className="h-6 w-6 text-blue-600" />
                  Próximas Sesiones / Alumnos Asignados
                </h2>
                <span className="bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full">
                  {matriculas.length} ACTIVAS
                </span>
              </div>

              <div className="divide-y divide-slate-100">
                {matriculas.length > 0 ? (
                  matriculas.map((m) => (
                    <div key={m.id} className="p-6 hover:bg-slate-50 transition-colors">
                      <div className="flex flex-col sm:flex-row justify-between gap-4">
                        <div className="flex gap-4">
                          <div className="h-12 w-12 rounded-full bg-navy-100 flex items-center justify-center text-navy-600 font-bold text-lg">
                            {m.alumno.charAt(0)}
                          </div>
                          <div>
                            <h3 className="font-bold text-lg text-slate-900">{m.alumno}</h3>
                            <p className="text-sm text-slate-500 font-medium">{m.curso}</p>
                            <div className="mt-2 flex items-center gap-4 text-xs text-slate-500">
                              <span className="flex items-center gap-1">
                                <MapPinIcon className="h-3.5 w-3.5" />
                                {m.direccion_clases}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Link
                            href="/tutor/asistencias"
                            className="w-full sm:w-auto px-4 py-2 bg-navy-600 hover:bg-navy-700 text-white text-sm font-bold rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                          >
                            <CheckCircleIcon className="h-5 w-5" />
                            Marcar Asistencia
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-10 text-center">
                    <div className="bg-slate-100 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <UserGroupIcon className="h-8 w-8 text-slate-400" />
                    </div>
                    <p className="text-slate-500 font-medium">No tienes alumnos asignados para hoy.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Columna Derecha: Resumen de Perfil / Info Ráìda */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-lg font-bold text-navy-900 mb-4">Información de Tutor</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                  <span className="text-sm text-slate-500">DNI</span>
                  <span className="text-sm font-bold text-slate-900">{profile?.dni}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                  <span className="text-sm text-slate-500">Ciudad</span>
                  <span className="text-sm font-bold text-slate-900">{profile?.ciudad}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                  <span className="text-sm text-slate-500">Distrito</span>
                  <span className="text-sm font-bold text-slate-900">{profile?.distrito}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                  <span className="text-sm text-slate-500">Tarifa p/ Sesión</span>
                  <span className="text-sm font-bold text-green-600">S/ {profile?.tarifa_por_sesion}</span>
                </div>
              </div>
            </div>

            <div className="bg-gold-50 border border-gold-200 rounded-2xl p-6">
              <h3 className="font-bold text-gold-900 mb-2 flex items-center gap-2">
                <BellIcon className="h-5 w-5" />
                Recuerda
              </h3>
              <p className="text-xs text-gold-800 leading-relaxed">
                Debes registrar tu asistencia exactamente al llegar al domicilio del alumno. El sistema registra tu ubicación GPS para corroborar la sesión.
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

// Icono Bell para el recordatorio
function BellIcon(props) {
  return (
    <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31c.55-.258.943-.796.943-1.414 0-1.127-.015-2.246-.046-3.355a10.023 10.023 0 00-11.412-9.454C6.545 4.14 6 5.8 6 7.625v3.42c0 .618-.393 1.156-.943 1.414a23.846 23.846 0 00-5.454 1.309z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v1a3 3 0 106 0v-1" />
    </svg>
  );
}
