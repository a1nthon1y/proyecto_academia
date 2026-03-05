'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ChartBarIcon,
  CubeIcon,
  ShoppingCartIcon,
  ClipboardDocumentListIcon,
  ArrowUpIcon,
  UserGroupIcon,
  BuildingStorefrontIcon
} from '@heroicons/react/24/outline';

const reportes = [
  {
    id: 'inventario',
    name: 'Inventario',
    description: 'Reporte completo del estado actual del inventario',
    href: '/reportes/inventario',
    icon: CubeIcon,
    color: 'bg-blue-500',
    stats: {
      total: 'Materiales',
      metric: 'Stock actual'
    }
  },
  {
    id: 'compras',
    name: 'Compras',
    description: 'Análisis de compras por período y proveedor',
    href: '/reportes/compras',
    icon: ShoppingCartIcon,
    color: 'bg-green-500',
    stats: {
      total: 'Compras',
      metric: 'Monto total'
    }
  },
  {
    id: 'produccion',
    name: 'Producción',
    description: 'Estado de órdenes de producción y rendimiento',
    href: '/reportes/produccion',
    icon: ClipboardDocumentListIcon,
    color: 'bg-purple-500',
    stats: {
      total: 'Órdenes',
      metric: 'Completadas'
    }
  },
  {
    id: 'movimientos',
    name: 'Movimientos de Insumos',
    description: 'Historial de movimientos de insumos (materiales)',
    href: '/reportes/movimientos',
    icon: ArrowUpIcon,
    color: 'bg-orange-500',
    stats: {
      total: 'Movimientos',
      metric: 'Entradas/Salidas'
    }
  },
  {
    id: 'productos',
    name: 'Productos',
    description: 'Reporte completo de productos terminados',
    href: '/reportes/productos',
    icon: CubeIcon,
    color: 'bg-purple-500',
    stats: {
      total: 'Productos',
      metric: 'Stock actual'
    }
  },
  {
    id: 'movimientos-productos',
    name: 'Movimientos de Productos',
    description: 'Historial de movimientos de productos terminados',
    href: '/reportes/movimientos-productos',
    icon: ArrowUpIcon,
    color: 'bg-pink-500',
    stats: {
      total: 'Movimientos',
      metric: 'Entradas/Salidas'
    }
  },
  {
    id: 'clientes',
    name: 'Clientes',
    description: 'Información y estado de clientes',
    href: '/reportes/clientes',
    icon: UserGroupIcon,
    color: 'bg-indigo-500',
    stats: {
      total: 'Clientes',
      metric: 'Activos'
    }
  },
  {
    id: 'proveedores',
    name: 'Proveedores',
    description: 'Análisis de proveedores y actividad',
    href: '/reportes/proveedores',
    icon: BuildingStorefrontIcon,
    color: 'bg-red-500',
    stats: {
      total: 'Proveedores',
      metric: 'Con compras'
    }
  }
];

export default function ReportesLayout() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredReportes = reportes.filter(reporte =>
    reporte.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    reporte.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleReporteClick = (href) => {
    router.push(href);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3">
          <ChartBarIcon className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Reportes</h1>
            <p className="text-gray-600">
              Genera y analiza reportes detallados de todas las áreas del sistema
            </p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="max-w-md">
          <label htmlFor="search" className="sr-only">
            Buscar reportes
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <ChartBarIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="search"
              name="search"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Buscar reportes..."
              type="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Reportes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredReportes.map((reporte) => (
          <div
            key={reporte.id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => handleReporteClick(reporte.href)}
          >
            <div className="flex items-center">
              <div className={`flex-shrink-0 ${reporte.color} rounded-lg p-3`}>
                <reporte.icon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4 flex-1">
                <h3 className="text-lg font-medium text-gray-900">
                  {reporte.name}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  {reporte.description}
                </p>
              </div>
            </div>
            
            <div className="mt-4 flex items-center justify-between">
              <div className="text-sm text-gray-500">
                <span className="font-medium">{reporte.stats.total}</span>
                <span className="mx-1">•</span>
                <span>{reporte.stats.metric}</span>
              </div>
              <div className="text-sm text-gray-400">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredReportes.length === 0 && (
        <div className="text-center py-12">
          <ChartBarIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No se encontraron reportes</h3>
          <p className="mt-1 text-sm text-gray-500">
            No hay reportes que coincidan con tu búsqueda.
          </p>
        </div>
      )}

      {/* Quick Stats */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Acceso Rápido</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {reportes.map((reporte) => (
            <button
              key={reporte.id}
              onClick={() => handleReporteClick(reporte.href)}
              className="flex flex-col items-center p-4 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors"
            >
              <div className={`${reporte.color} rounded-lg p-2 mb-2`}>
                <reporte.icon className="h-5 w-5 text-white" />
              </div>
              <span className="text-sm font-medium text-gray-900">{reporte.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
} 