'use client';

import { BellIcon } from '@heroicons/react/24/outline';
import { getRolName } from '@/utils/roles';

export function Header({ user }) {
  return (
    <header className="bg-white shadow">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <h1 className="text-xl font-semibold text-gray-900">
        </h1>

        <div className="flex items-center gap-4">
          {/* Notificaciones */}
          <button
            type="button"
            className="rounded-full bg-white p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            <span className="sr-only">Ver notificaciones</span>
            <BellIcon className="h-6 w-6" aria-hidden="true" />
          </button>

          {/* Perfil del usuario */}
          <div className="flex items-center">
            <div className="ml-3">
              <div className="text-sm font-medium text-gray-700">{user?.email || 'Usuario'}</div>
              <div className="text-xs text-gray-500">{getRolName(user?.rol_id)}</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
} 