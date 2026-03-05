'use client';

import { useState } from 'react';
import { 
  CalendarIcon, 
  DocumentArrowDownIcon,
  FunnelIcon 
} from '@heroicons/react/24/outline';

export default function ReporteFiltros({ 
  filtros, 
  onFiltrosChange, 
  onExportar,
  tiposExportacion = ['excel', 'pdf'],
  mostrarFiltros = true 
}) {
  const [mostrarFiltrosAvanzados, setMostrarFiltrosAvanzados] = useState(false);

  const handleFiltroChange = (key, value) => {
    onFiltrosChange({
      ...filtros,
      [key]: value
    });
  };

  const handleExportar = (tipo) => {
    onExportar({
      ...filtros,
      export: tipo
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        {/* Filtros */}
        {mostrarFiltros && (
          <div className="flex flex-col lg:flex-row gap-4 flex-1">
            {/* Filtros básicos */}
            <div className="flex flex-col lg:flex-row gap-4 flex-1">
              {'desde' in filtros && (
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Desde
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      value={filtros.desde || ''}
                      onChange={(e) => handleFiltroChange('desde', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <CalendarIcon className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
                  </div>
                </div>
              )}

              {'hasta' in filtros && (
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Hasta
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      value={filtros.hasta || ''}
                      onChange={(e) => handleFiltroChange('hasta', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <CalendarIcon className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
                  </div>
                </div>
              )}

              {'estado' in filtros && (
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Estado
                  </label>
                  <select
                    value={filtros.estado || ''}
                    onChange={(e) => handleFiltroChange('estado', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Todos</option>
                    <option value="activo">Activo</option>
                    <option value="inactivo">Inactivo</option>
                  </select>
                </div>
              )}

              {'material_id' in filtros && (
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Material
                  </label>
                  <select
                    value={filtros.material_id || ''}
                    onChange={(e) => handleFiltroChange('material_id', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Todos los materiales</option>
                    {/* Aquí se cargarían los materiales dinámicamente */}
                  </select>
                </div>
              )}

              {'producto_id' in filtros && (
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Producto
                  </label>
                  <select
                    value={filtros.producto_id || ''}
                    onChange={(e) => handleFiltroChange('producto_id', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Todos los productos</option>
                    {/* Aquí se cargarían los productos dinámicamente */}
                  </select>
                </div>
              )}
            </div>

            {/* Botón para filtros avanzados */}
            <button
              onClick={() => setMostrarFiltrosAvanzados(!mostrarFiltrosAvanzados)}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
              <FunnelIcon className="h-4 w-4" />
              Filtros Avanzados
            </button>
          </div>
        )}

        {/* Botones de exportación */}
        <div className="flex gap-2">
          {tiposExportacion.includes('excel') && (
            <button
              onClick={() => handleExportar('excel')}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-green-700 bg-green-100 rounded-md hover:bg-green-200 transition-colors"
            >
              <DocumentArrowDownIcon className="h-4 w-4" />
              Exportar Excel
            </button>
          )}
          
          {tiposExportacion.includes('pdf') && (
            <button
              onClick={() => handleExportar('pdf')}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-700 bg-red-100 rounded-md hover:bg-red-200 transition-colors"
            >
              <DocumentArrowDownIcon className="h-4 w-4" />
              Exportar PDF
            </button>
          )}
        </div>
      </div>

      {/* Filtros avanzados */}
      {mostrarFiltrosAvanzados && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Aquí se pueden agregar filtros adicionales específicos de cada reporte */}
          </div>
        </div>
      )}
    </div>
  );
} 