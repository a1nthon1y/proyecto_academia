'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { getMisMatriculasTutor } from '@/services/tutoresService';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { DataTable } from '@/components/tables/DataTable';
import { UserGroupIcon, PhoneIcon, MapPinIcon, AcademicCapIcon } from '@heroicons/react/24/outline';

export default function TutorAlumnosPage() {
    const [loading, setLoading] = useState(true);
    const [matriculas, setMatriculas] = useState([]);

    useEffect(() => {
        async function loadAlumnos() {
            try {
                const data = await getMisMatriculasTutor();
                setMatriculas(data);
            } catch (error) {
                console.error('Error loading tutor students:', error);
            } finally {
                setLoading(false);
            }
        }
        loadAlumnos();
    }, []);

    const columns = [
        {
            key: 'alumno',
            header: 'Alumno',
            render: (row) => (
                <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-navy-100 text-navy-600 flex items-center justify-center font-bold text-xs">
                        {row.alumno.charAt(0)}
                    </div>
                    <div>
                        <div className="font-bold text-slate-900">{row.alumno}</div>
                        <div className="text-xs text-slate-500">DNI: {row.alumno_dni}</div>
                    </div>
                </div>
            )
        },
        {
            key: 'curso',
            header: 'Curso Asignado',
            render: (row) => (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {row.curso}
                </span>
            )
        },
        {
            key: 'direccion_clases',
            header: 'Ubicación / Dirección',
            render: (row) => (
                <div className="flex items-center gap-1.5 text-xs text-slate-600">
                    <MapPinIcon className="h-4 w-4 text-slate-400" />
                    {row.direccion_clases}
                </div>
            )
        },
        {
            key: 'estado',
            header: 'Estado Matrícula',
            render: (row) => (
                <span className="inline-flex items-center px-2 py-1 rounded-lg text-xs font-bold bg-green-50 text-green-700 border border-green-200">
                    {row.estado}
                </span>
            )
        }
    ];

    if (loading) return (
        <DashboardLayout>
            <div className="flex h-64 items-center justify-center">
                <LoadingSpinner title="Cargando tus alumnos..." />
            </div>
        </DashboardLayout>
    );

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-navy-900">Alumnos Asignados</h1>
                        <p className="text-sm text-slate-500">Listado detallado de estudiantes bajo tu tutoría activa.</p>
                    </div>
                    <div className="bg-white p-2 rounded-xl border border-slate-200 shadow-sm flex items-center gap-2">
                        <UserGroupIcon className="h-6 w-6 text-navy-600" />
                        <span className="font-bold text-navy-900">{matriculas.length} Alumnos</span>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    {matriculas.length > 0 ? (
                        <DataTable
                            columns={columns}
                            data={matriculas}
                            pageSize={10}
                        />
                    ) : (
                        <div className="p-20 text-center">
                            <div className="bg-slate-50 h-20 w-20 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
                                <AcademicCapIcon className="h-10 w-10 text-slate-300" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 mb-1">Sin alumnos registrados</h3>
                            <p className="text-slate-500 max-w-xs mx-auto">
                                Actualmente no tienes matrículas activas asignadas. Contacta con administración si crees que esto es un error.
                            </p>
                        </div>
                    )}
                </div>

                {/* Card Informativa */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-navy-50 border border-navy-100 rounded-2xl p-6">
                        <h4 className="font-bold text-navy-900 mb-2 flex items-center gap-2">
                            <PhoneIcon className="h-5 w-5 text-navy-600" />
                            Coordinación
                        </h4>
                        <p className="text-sm text-navy-800 leading-relaxed">
                            Recuerda que para coordinaciones directas con los padres, la administración debe proporcionarte los datos de contacto autorizados. Respeta siempre los canales de comunicación de la Academia.
                        </p>
                    </div>
                    <div className="bg-gold-50 border border-gold-200 rounded-2xl p-6">
                        <h4 className="font-bold text-gold-900 mb-2 flex items-center gap-2">
                            <MapPinIcon className="h-5 w-5 text-gold-600" />
                            Rutas de Clase
                        </h4>
                        <p className="text-sm text-gold-800 leading-relaxed">
                            Planifica tus rutas con anticipación. El registro de asistencia geolocalizado solo es válido si se realiza dentro del rango permitido del domicilio del alumno.
                        </p>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
