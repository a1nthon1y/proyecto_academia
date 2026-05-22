'use client';

import { BellIcon } from '@heroicons/react/24/outline';
import { getRolName } from '@/utils/roles';

export function Header({ user }) {
  const email = user?.email || 'Usuario';
  const rolName = getRolName(user?.rol_id);

  return (
    <header className="hidden lg:block bg-white shadow">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <h1 className="text-xl font-semibold text-gray-900">
        </h1>

        <div className="flex items-center gap-3 sm:gap-4 min-w-0">
          <button
            type="button"
            className="rounded-full bg-white p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 flex-shrink-0"
          >
            <span className="sr-only">Ver notificaciones</span>
            <BellIcon className="h-6 w-6" aria-hidden="true" />
          </button>

          <div className="flex items-center min-w-0">
            <div className="text-right min-w-0">
              <div
                className="text-sm font-medium text-gray-700 truncate max-w-[180px] sm:max-w-[240px]"
                title={email}
              >
                {email}
              </div>
              <div className="text-xs text-gray-500">{rolName}</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
