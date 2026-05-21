'use client';

import { useState, useMemo } from 'react';
import { useMatriculas } from '@/hooks/useMatriculas';
import { useCambiarEstadoMatricula, useEliminarMatricula } from '@/hooks/useMatriculasMutations';
import { usePermissions } from '@/hooks/usePermissions';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { DataTable } from '@/components/tables/DataTable';
import { Calendar, DollarSign, GraduationCap, Edit2, Trash2, UserPlus, Printer, AlertCircle, ClipboardList, Search, X } from 'lucide-react';
import { ModalBuscadorTutor } from './ModalBuscadorTutor';
import { ConstanciaMatricula } from './ConstanciaMatricula';
import { useActualizarMatricula } from '@/hooks/useMatriculasMutations';
import Swal from 'sweetalert2';

const ESTADOS = ['ACTIVO', 'PENDIENTE', 'FINALIZADO', 'CANCELADO'];
const ESTADO_COLORS = {
  ACTIVO:    'bg-green-100 text-green-700 border-green-200',
  PENDIENTE: 'bg-orange-100 text-orange-700 border-orange-200',
  FINALIZADO:'bg-blue-100 text-blue-700 border-blue-200',
  CANCELADO: 'bg-red-100 text-red-700 border-red-200',
};

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
  const [search, setSearch] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('');

  const matriculasFiltradas = useMemo(() => {
    let list = matriculas || [];
    if (filtroEstado) list = list.filter((m) => m.estado === filtroEstado);
    if (search.trim()) {
      const s = search.trim().toLowerCase();
      list = list.filter((m) =>
        (m.alumno || '').toLowerCase().includes(s) ||
        (m.alumno_dni || '').toLowerCase().includes(s) ||
        (m.tutor || '').toLowerCase().includes(s) ||
        (m.padre || '').toLowerCase().includes(s) ||
        (m.curso || '').toLowerCase().includes(s)
      );
    }
    return list;
  }, [matriculas, search, filtroEstado]);

  const handleCambiarEstado = async (id, nuevoEstado) => {
    const result = await Swal.fire({
      title: `¿Cambiar estado a ${nuevoEstado}?`,
      text: 'Esta acción actualizará el estado de la matrícula.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#1e3a8a',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Sí, cambiar',
      cancelButtonText: 'Cancelar',
    });
    if (result.isConfirmed) {
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
    const result = await Swal.fire({
      title: '¿Eliminar matrícula?',
      html: `Se eliminará permanentemente la matrícula de <b>${alumnoNombre}</b>.<br/><br/>Esta acción <b>no se puede deshacer</b>.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    });
    if (result.isConfirmed) {
      await eliminarMutation.mutateAsync(id);
    }
  };

  if (isLoading) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-12 flex justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (matriculas.length === 0) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-12 text-center text-slate-500">
        <ClipboardList className="h-12 w-12 mx-auto text-slate-300 mb-3" />
        <p className="text-sm">No hay matrículas registradas aún.</p>
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

  const hayFiltros = search.trim() || filtroEstado;

  return (
    <>
      {/* Barra de filtros */}
      <div className="rounded-t-xl border border-b-0 border-slate-200 bg-white px-4 py-3 flex items-center justify-between flex-wrap gap-3">
        {/* Filtros por estado */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs text-slate-500 font-medium mr-1">Estado:</span>
          <button
            onClick={() => setFiltroEstado('')}
            className={`px-2.5 py-1 rounded-full text-xs font-medium border transition ${!filtroEstado ? 'bg-slate-800 text-white border-slate-800' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'}`}
          >
            Todos
          </button>
          {ESTADOS.map((e) => (
            <button
              key={e}
              onClick={() => setFiltroEstado(filtroEstado === e ? '' : e)}
              className={`px-2.5 py-1 rounded-full text-xs font-medium border transition ${filtroEstado === e ? ESTADO_COLORS[e] : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'}`}
            >
              {e}
              {filtroEstado === e && (
                <span className="ml-1 opacity-70">({matriculasFiltradas.length})</span>
              )}
            </button>
          ))}
        </div>

        {/* Búsqueda */}
        <div className="flex items-center gap-2">
          {hayFiltros && (
            <button
              onClick={() => { setSearch(''); setFiltroEstado(''); }}
              className="text-xs text-slate-500 hover:text-slate-700 flex items-center gap-1 transition"
            >
              <X className="h-3 w-3" /> Limpiar
            </button>
          )}
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <input
              type="search"
              placeholder="Alumno, DNI, tutor, padre, curso…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-64 pl-8 pr-3 py-1.5 text-sm rounded-lg border border-slate-300 focus:border-navy-500 focus:ring-2 focus:ring-navy-100 outline-none"
            />
          </div>
          <span className="text-xs text-slate-500 whitespace-nowrap">
            {matriculasFiltradas.length} de {(matriculas || []).length}
          </span>
        </div>
      </div>

      <DataTable columns={columns} data={matriculasFiltradas} isLoading={isLoading} />
      <ModalBuscadorTutor
        visible={tutorModal.visible}
        onClose={() => setTutorModal({ ...tutorModal, visible: false })}
        onSelect={handleAsignarTutor}
        alumnoNombre={tutorModal.alumnoNombre}
      />
    </>
  );
}
