'use client';

import { useState, useEffect } from 'react';
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
  // Cerrado por defecto en móvil; abierto en desktop (CSS lo fuerza con lg:translate-x-0)
  const [isOpen, setIsOpen] = useState(false);

  // Cerrar el sidebar automáticamente al cambiar de ruta en móvil
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Bloquear scroll del body cuando el sidebar móvil está abierto
  useEffect(() => {
    if (typeof document === 'undefined') return;
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const handleLogout = () => logout();

  const toggleSubmenu = (item) => {
    if (item.submenu?.length > 0) {
      setOpenMenus((prev) => ({
        ...prev,
        [item.name]: !prev[item.name],
      }));
      router.push(item.submenu[0].href);
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
      {/* Barra superior móvil con botón hamburguesa */}
      <div className="lg:hidden sticky top-0 z-30 flex items-center justify-between bg-gray-900 px-3 py-3 shadow-md">
        <button
          onClick={() => setIsOpen(true)}
          className="rounded-md p-1.5 text-gray-300 transition hover:bg-gray-800 hover:text-white"
          aria-label="Abrir menú"
        >
          <Bars3Icon className="h-6 w-6" />
        </button>
        <span className="text-blue-400 font-bold">Deoxy Academia</span>
        <div className="w-9" /> {/* spacer para centrar */}
      </div>

      {/* Backdrop oscuro al abrir en móvil */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity animate-fadeIn"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <div className={`${isOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 fixed lg:static z-50 flex h-full w-72 max-w-[85vw] flex-col bg-gray-900 shadow-xl transform transition-transform duration-300`}>

        {/* Logo + botón cerrar (mobile) */}
        <div className="flex h-16 items-center justify-between border-b border-gray-800 px-4 lg:justify-center">
          <span className="text-xl lg:text-2xl font-bold text-blue-400">Deoxy Academia</span>
          <button
            onClick={() => setIsOpen(false)}
            className="lg:hidden rounded-md p-1.5 text-gray-400 transition hover:bg-gray-800 hover:text-white"
            aria-label="Cerrar menú"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
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
