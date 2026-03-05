'use client';

import { useState } from 'react';
import { useMatriculas } from '@/hooks/useMatriculas';
import { useCambiarEstadoMatricula, useEliminarMatricula } from '@/hooks/useMatriculasMutations';
import { usePermissions } from '@/hooks/usePermissions';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { DataTable } from '@/components/tables/DataTable';
import { Calendar, DollarSign, User, GraduationCap, Edit2, Trash2, UserPlus, Printer, AlertCircle } from 'lucide-react';
import { ModalBuscadorTutor } from './ModalBuscadorTutor';
import { ConstanciaMatricula } from './ConstanciaMatricula';
import { useActualizarMatricula } from '@/hooks/useMatriculasMutations';

/**
 * Componente que muestra la lista de matrículas con información completa
 * Muestra acciones según permisos por rol (ADMIN/TRABAJADOR)
 */
export function ListaMatriculas({ onEdit }) {
  const { matriculas, isLoading } = useMatriculas();
  const cambiarEstadoMutation = useCambiarEstadoMatricula();
  const eliminarMutation = useEliminarMatricula();
  const { canEdit, canDelete, canChangeStatus } = usePermissions();
  const actualizarMutation = useActualizarMatricula();

  const [tutorModal, setTutorModal] = useState({ visible: false, matriculaId: null, alumnoNombre: '' });
  const [selectedForPrint, setSelectedForPrint] = useState(null);

  const handleCambiarEstado = async (id, nuevoEstado) => {
    if (confirm(`¿Está seguro de cambiar el estado a ${nuevoEstado}?`)) {
      await cambiarEstadoMutation.mutateAsync({ id, estado: nuevoEstado });
    }
  };

  const handleAsignarTutor = async (tutor) => {
    try {
      await actualizarMutation.mutateAsync({
        id: tutorModal.matriculaId,
        data: { tutor_id: tutor.id }
      });
      // Toast ya lo maneja el mutation
    } catch (error) {
      console.error('Error al asignar tutor:', error);
    }
  };

  const handleImprimir = (matricula) => {
    setSelectedForPrint(matricula);
    // Pequeño delay para asegurar que el componente esté en el DOM antes de imprimir
    setTimeout(() => {
      window.print();
      setSelectedForPrint(null);
    }, 100);
  };

  const handleEliminar = async (id, alumnoNombre) => {
    if (confirm(`⚠️ ADVERTENCIA: ¿Está seguro de ELIMINAR PERMANENTEMENTE la matrícula de ${alumnoNombre}?\n\nEsta acción NO se puede deshacer.\n\nSolo elimine si es absolutamente necesario.`)) {
      await eliminarMutation.mutateAsync(id);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <LoadingSpinner />
      </div>
    );
  }

  if (matriculas.length === 0) {
    return (
      <div className="rounded-xl bg-slate-50 border border-slate-200 p-4 text-center">
        <p className="text-sm text-slate-600">
          No hay matrículas registradas aún.
        </p>
      </div>
    );
  }

  const columns = [
    {
      key: 'id',
      header: 'ID',
      render: (row) => <span className="font-mono text-xs">#{row.id}</span>,
    },
    {
      key: 'alumno',
      header: 'Alumno',
      render: (row) => (
        <div className="flex flex-col">
          <span className="font-medium text-sm">{row.alumno}</span>
          <span className="text-xs text-slate-500">DNI: {row.alumno_dni}</span>
          {row.alumno_nivel && (
            <span className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
              <GraduationCap className="h-3 w-3" />
              {row.alumno_nivel}
            </span>
          )}
        </div>
      ),
    },
    {
      key: 'padre',
      header: 'Padre',
      render: (row) => (
        <div className="flex flex-col">
          <span className="text-sm">{row.padre}</span>
          {row.padre_email && (
            <span className="text-xs text-slate-500">{row.padre_email}</span>
          )}
        </div>
      ),
    },
    {
      key: 'tutor',
      header: 'Tutor',
      render: (row) => (
        <div className="flex flex-col">
          {row.tutor ? (
            <>
              <span className="text-sm font-medium">{row.tutor}</span>
              {row.tutor_especialidad && (
                <span className="text-xs text-slate-500">{row.tutor_especialidad}</span>
              )}
              {row.tutor_telefono && (
                <span className="text-xs text-slate-500">{row.tutor_telefono}</span>
              )}
            </>
          ) : (
            <div className="flex flex-col gap-1">
              <span className="text-xs font-semibold text-orange-600 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                Sin Asignar
              </span>
              {canEdit && (
                <button
                  onClick={() => setTutorModal({ visible: true, matriculaId: row.id, alumnoNombre: row.alumno })}
                  className="text-[10px] px-2 py-0.5 bg-orange-100 text-orange-700 rounded border border-orange-200 hover:bg-orange-200 transition flex items-center justify-center gap-1"
                >
                  <UserPlus className="h-3 w-3" />
                  Asignar ahora
                </button>
              )}
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'curso',
      header: 'Curso',
      render: (row) => (
        <div className="flex flex-col">
          <span className="text-sm font-medium">{row.curso}</span>
          {row.curso_costo && (
            <span className="text-xs text-green-600 font-semibold flex items-center gap-1">
              <DollarSign className="h-3 w-3" />
              S/. {parseFloat(row.curso_costo).toFixed(2)}/mes
            </span>
          )}
        </div>
      ),
    },
    {
      key: 'fechas',
      header: 'Fechas',
      render: (row) => (
        <div className="flex flex-col text-xs text-slate-600">
          {row.fecha_inicio && (
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              Inicio: {new Date(row.fecha_inicio).toLocaleDateString('es-PE')}
            </span>
          )}
          {row.fecha_fin && (
            <span className="flex items-center gap-1 mt-0.5">
              <Calendar className="h-3 w-3" />
              Fin: {new Date(row.fecha_fin).toLocaleDateString('es-PE')}
            </span>
          )}
        </div>
      ),
    },
    {
      key: 'estado',
      header: 'Estado',
      render: (row) => (
        <div className="flex flex-col gap-1">
          <span
            className={`px-2 py-1 text-xs font-medium rounded-full text-center ${row.estado === 'ACTIVO'
              ? 'bg-green-100 text-green-700'
              : row.estado === 'PENDIENTE'
                ? 'bg-orange-100 text-orange-700 border border-orange-200'
                : row.estado === 'FINALIZADO'
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-red-100 text-red-700'
              }`}
          >
            {row.estado}
          </span>
          {canChangeStatus && (
            <div className="flex flex-col gap-1 mt-1">
              {row.estado === 'ACTIVO' && (
                <>
                  <button
                    onClick={() => handleCambiarEstado(row.id, 'FINALIZADO')}
                    className="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded hover:bg-blue-100 transition text-left group relative"
                    disabled={cambiarEstadoMutation.isPending}
                    title="Marcar como completado exitosamente"
                  >
                    Finalizar
                  </button>
                  <button
                    onClick={() => handleCambiarEstado(row.id, 'CANCELADO')}
                    className="text-xs px-2 py-1 bg-red-50 text-red-700 rounded hover:bg-red-100 transition text-left"
                    disabled={cambiarEstadoMutation.isPending}
                    title="Marcar como cancelado por impago o retiro"
                  >
                    Cancelar
                  </button>
                </>
              )}
              {/* Permitir reactivar si fue finalizado o cancelado por error */}
              {(row.estado === 'FINALIZADO' || row.estado === 'CANCELADO') && (
                <button
                  onClick={() => handleCambiarEstado(row.id, 'ACTIVO')}
                  className="text-xs px-2 py-1 bg-green-50 text-green-700 rounded hover:bg-green-100 transition text-left"
                  disabled={cambiarEstadoMutation.isPending}
                  title="Reactivar matrícula"
                >
                  Reactivar
                </button>
              )}
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'acciones',
      header: 'Acciones',
      render: (row) => (
        <div className="flex flex-col gap-1">
          <button
            onClick={() => handleImprimir(row)}
            className="text-xs px-2 py-1 bg-navy-50 text-navy-700 rounded hover:bg-navy-100 transition flex items-center gap-1 justify-center border border-navy-100"
          >
            <Printer className="h-3 w-3" />
            Imprimir
          </button>
          {canEdit && (
            <button
              onClick={() => onEdit && onEdit(row.id)}
              className="text-xs px-2 py-1 bg-slate-100 text-slate-700 rounded hover:bg-slate-200 transition flex items-center gap-1 justify-center"
            >
              <Edit2 className="h-3 w-3" />
              Editar
            </button>
          )}
          {canDelete && (
            <button
              onClick={() => handleEliminar(row.id, row.alumno)}
              className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition flex items-center gap-1 justify-center"
              disabled={eliminarMutation.isPending}
            >
              <Trash2 className="h-3 w-3" />
              Eliminar
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <>
      <DataTable columns={columns} data={matriculas} isLoading={isLoading} />
      <ModalBuscadorTutor
        visible={tutorModal.visible}
        onClose={() => setTutorModal({ ...tutorModal, visible: false })}
        onSelect={handleAsignarTutor}
        alumnoNombre={tutorModal.alumnoNombre}
      />
    </>
  );
}
