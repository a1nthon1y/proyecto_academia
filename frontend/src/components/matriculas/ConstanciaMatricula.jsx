'use client';

import { GraduationCap, MapPin, Calendar, User, Phone, Mail, DollarSign } from 'lucide-react';

/**
 * Componente diseñado para impresión de constancia de matrícula
 */
export function ConstanciaMatricula({ data }) {
    if (!data) return null;

    return (
        <div className="print-only hidden print:block p-8 bg-white text-slate-900 font-serif max-w-[21cm] mx-auto border border-slate-200">
            {/* Cabecera */}
            <div className="flex justify-between items-start border-b-2 border-navy-800 pb-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-navy-900 uppercase">Academia Deoxy</h1>
                    <p className="text-sm text-slate-500 italic">Excelencia Educativa Personalizada</p>
                </div>
                <div className="text-right">
                    <p className="font-bold">CONTRATO DE MATRÍCULA</p>
                    <p className="text-sm">Folio: #{data.id}</p>
                    <p className="text-sm">Fecha: {new Date().toLocaleDateString('es-PE')}</p>
                </div>
            </div>

            {/* Cuerpo */}
            <div className="space-y-8">
                <section>
                    <h2 className="text-lg font-bold bg-slate-100 px-3 py-1 border-l-4 border-navy-600 mb-4 uppercase">1. Información del Alumno</h2>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div><span className="font-bold">Nombre Completo:</span> {data.alumno}</div>
                        <div><span className="font-bold">DNI:</span> {data.alumno_dni}</div>
                        <div><span className="font-bold">Nivelacadémico:</span> {data.alumno_nivel}</div>
                        <div><span className="font-bold">Padre/Apoderado:</span> {data.padre}</div>
                    </div>
                </section>

                <section>
                    <h2 className="text-lg font-bold bg-slate-100 px-3 py-1 border-l-4 border-navy-600 mb-4 uppercase">2. Detalles del Curso</h2>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="col-span-2"><span className="font-bold">Curso:</span> {data.curso}</div>
                        <div className="col-span-2"><span className="font-bold">Dirección de Clases:</span> {data.direccion_clases || 'A coordinar'}</div>
                        <div><span className="font-bold">Fecha de Inicio:</span> {data.fecha_inicio ? new Date(data.fecha_inicio).toLocaleDateString('es-PE') : 'Pendiente'}</div>
                        <div><span className="font-bold">Fecha de Término:</span> {data.fecha_fin ? new Date(data.fecha_fin).toLocaleDateString('es-PE') : 'Flexible'}</div>
                        <div className="text-lg font-bold text-navy-800 mt-2">
                            Costo Mensual: S/. {parseFloat(data.curso_costo || 0).toFixed(2)}
                        </div>
                    </div>
                </section>

                <section>
                    <h2 className="text-lg font-bold bg-slate-100 px-3 py-1 border-l-4 border-navy-600 mb-4 uppercase">3. Tutor Asignado</h2>
                    {data.tutor ? (
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div><span className="font-bold">Docente:</span> {data.tutor}</div>
                            <div><span className="font-bold">Especialidad:</span> {data.tutor_especialidad}</div>
                            <div><span className="font-bold">Contacto:</span> {data.tutor_telefono}</div>
                            <div><span className="font-bold">Email:</span> {data.tutor_email}</div>
                        </div>
                    ) : (
                        <p className="text-sm italic text-slate-500">Tutor pendiente de asignación definitiva según disponibilidad geográfica.</p>
                    )}
                </section>

                <section className="mt-16">
                    <p className="text-[10px] text-slate-500 leading-tight">
                        Academia Deoxy se compromete a brindar un servicio de tutoría de alta calidad. El padre de familia se compromete a facilitar el espacio adecuado para las clases y cumplir con los pagos mensuales dentro de los primeros 5 días de cada periodo. Este documento constituye una constancia oficial de registro en nuestro sistema.
                    </p>
                </section>

                {/* Firmas */}
                <div className="grid grid-cols-2 gap-12 mt-20">
                    <div className="border-t border-slate-400 text-center pt-2">
                        <p className="text-sm font-bold">Firma del Apoderado</p>
                        <p className="text-xs text-slate-400">Nombre: {data.padre}</p>
                    </div>
                    <div className="border-t border-slate-400 text-center pt-2">
                        <p className="text-sm font-bold">Por Academia Deoxy</p>
                        <p className="text-xs text-slate-400">Dirección Académica</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
