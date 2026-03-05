'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useLogout } from '@/hooks/useLogout';
import { ROLES, getRolName } from '@/utils/roles';
import {
  HomeIcon,
  UsersIcon,
  ClipboardDocumentListIcon,
  ArrowLeftOnRectangleIcon,
  UserGroupIcon,
  ChartBarIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  Bars3Icon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

// Navegación adaptada al dominio de Academia Lumen
// Cada entrada define qué rol_id pueden verla (usando números)
// NOTA: Las páginas principales (/padre, /tutor, etc.) redirigen automáticamente a sus módulos principales
const navigation = [
  // PADRE (rol_id = 3) - Asistencias primero (mejora UX)
  {
    name: 'Asistencias de tutores',
    href: '/padre/asistencias',
    icon: ClipboardDocumentListIcon,
    roles: [ROLES.PADRE],
  },
  {
    name: 'Historial de sesiones',
    href: '/padre/historial',
    icon: ChartBarIcon,
    roles: [ROLES.PADRE],
  },

  // TUTOR (rol_id = 4)
  {
    name: 'Mi Panel',
    href: '/tutor',
    icon: HomeIcon,
    roles: [ROLES.TUTOR],
  },
  {
    name: 'Asistencias',
    href: '/tutor/asistencias',
    icon: ClipboardDocumentListIcon,
    roles: [ROLES.TUTOR],
  },
  {
    name: 'Estudiantes',
    href: '/tutor/alumnos',
    icon: UserGroupIcon,
    roles: [ROLES.TUTOR],
  },

  // TRABAJADOR (rol_id = 2) y ADMIN (rol_id = 1) - Asistencias primero (mejora UX)
  {
    name: 'Control de asistencias',
    href: '/trabajador/asistencias',
    icon: ClipboardDocumentListIcon,
    roles: [ROLES.TRABAJADOR, ROLES.ADMIN],
  },
  {
    name: 'Matrículas',
    href: '/trabajador/matriculas',
    icon: ClipboardDocumentListIcon,
    roles: [ROLES.TRABAJADOR, ROLES.ADMIN],
  },
  {
    name: 'Pagos',
    href: '/trabajador/pagos',
    icon: ChartBarIcon,
    roles: [ROLES.TRABAJADOR, ROLES.ADMIN],
  },
  {
    name: 'Consultas',
    href: '/trabajador/consultas',
    icon: ClipboardDocumentListIcon,
    roles: [ROLES.TRABAJADOR, ROLES.ADMIN],
  },
  {
    name: 'Alumnos',
    href: '/trabajador/alumnos',
    icon: UserGroupIcon,
    roles: [ROLES.TRABAJADOR, ROLES.ADMIN],
  },
  {
    name: 'Padres de familia',
    href: '/trabajador/padres',
    icon: UserGroupIcon,
    roles: [ROLES.TRABAJADOR, ROLES.ADMIN],
  },
  {
    name: 'Tutores',
    href: '/trabajador/tutores',
    icon: UsersIcon,
    roles: [ROLES.TRABAJADOR, ROLES.ADMIN],
  },

  // ADMIN (rol_id = 1) - Gestión de usuarios primero (historia de usuario #7)
  {
    name: 'Usuarios del sistema',
    href: '/usuarios',
    icon: UsersIcon,
    roles: [ROLES.ADMIN],
  },
];

export function Sidebar({ user }) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useLogout();
  const [openMenus, setOpenMenus] = useState({});
  const [isOpen, setIsOpen] = useState(true);

  const handleLogout = () => logout();

  const toggleSubmenu = (item) => {
    // Si tiene submenú, al hacer clic:
    // 1. se expande el menú
    // 2. navega al primer enlace del submenú (como antes)
    if (item.submenu?.length > 0) {
      setOpenMenus((prev) => ({
        ...prev,
        [item.name]: !prev[item.name],
      }));

      // Navega al primer enlace del submenú
      const firstHref = item.submenu[0].href;
      router.push(firstHref);
    } else {
      router.push(item.href);
    }
  };

  const filteredNavigation = navigation.filter(item =>
    user?.rol_id && item.roles.includes(user.rol_id)
  );

  const isActiveLink = (href) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <>
      {/* Botón hamburguesa (solo en móvil) */}
      <div className="lg:hidden flex items-center bg-gray-900 p-3">
        <button onClick={() => setIsOpen(!isOpen)} className="text-gray-300 hover:text-white">
          {isOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
        </button>
        <span className="ml-3 text-blue-400 font-bold">Deoxy Academia</span>
      </div>

      {/* Sidebar */}
      <div className={`${isOpen ? 'translate-x-0' : '-translate-x-full'} 
          lg:translate-x-0 fixed lg:static z-40 flex h-full w-64 flex-col bg-gray-900 shadow-xl transform transition-transform duration-300`}>

        {/* Logo */}
        <div className="hidden lg:flex h-16 items-center justify-center border-b border-gray-800">
          <span className="text-2xl font-bold text-blue-400">Deoxy Academia</span>
        </div>

        {/* Navegación */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {filteredNavigation.map((item) => {
            const isActive = isActiveLink(item.href);
            const isOpenMenu = openMenus[item.name] || isActive;

            return (
              <div key={item.name} className="space-y-1">
                <button
                  onClick={() => toggleSubmenu(item)}
                  className={`w-full flex items-center justify-between rounded-md px-3 py-2 text-sm font-medium transition-all duration-150 ${isActive
                      ? 'bg-gray-800 text-white'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                    }`}
                >
                  <div className="flex items-center">
                    <item.icon
                      className={`mr-3 h-5 w-5 ${isActive ? 'text-blue-400' : 'text-gray-400 group-hover:text-white'
                        }`}
                    />
                    {item.name}
                  </div>

                  {item.submenu && (
                    isOpenMenu
                      ? <ChevronDownIcon className="h-4 w-4 text-gray-400" />
                      : <ChevronRightIcon className="h-4 w-4 text-gray-400" />
                  )}
                </button>

                {/* Submenú */}
                {item.submenu && isOpenMenu && (
                  <div className="ml-8 border-l border-gray-700 pl-3 space-y-1 animate-fadeIn">
                    {item.submenu.map((subitem) => (
                      <Link
                        key={subitem.name}
                        href={subitem.href}
                        className={`block rounded-md px-2 py-1.5 text-sm transition-all duration-150 ${pathname === subitem.href
                            ? 'bg-gray-800 text-blue-400'
                            : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                          }`}
                      >
                        {subitem.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Usuario y Logout */}
        <div className="border-t border-gray-800 p-4">
          <div className="flex items-center mb-3">
            <div className="flex-1">
              <p className="font-semibold text-white text-sm">{user?.email || 'Usuario'}</p>
              <p className="text-gray-400 text-xs">{getRolName(user?.rol_id)}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex w-full items-center justify-center gap-2 rounded-md bg-gray-800 px-3 py-2 text-sm font-medium text-gray-300 hover:bg-red-600 hover:text-white transition-all duration-200"
          >
            <ArrowLeftOnRectangleIcon className="h-5 w-5" />
            Cerrar Sesión
          </button>
        </div>
      </div>
    </>
  );
}
