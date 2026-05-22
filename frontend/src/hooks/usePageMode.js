'use client';

import { useCallback, useMemo } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';

/**
 * Sincroniza el modo (lista/crear/editar) y el id seleccionado con la URL.
 * Beneficios:
 *   • El botón "Atrás" del navegador funciona naturalmente
 *   • Refresh mantiene el formulario abierto
 *   • Se puede compartir un link directo a editar (ej. ?modo=editar&id=42)
 *
 * Uso:
 *   const { mode, id, openCreate, openEdit, backToList } = usePageMode();
 *
 *   if (mode === 'crear') return <FormCrear ... />;
 *   if (mode === 'editar' && id) return <FormEditar id={id} ... />;
 */
export function usePageMode() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const modeRaw = searchParams.get('modo') || 'lista';
    const mode = ['lista', 'crear', 'editar'].includes(modeRaw) ? modeRaw : 'lista';
    const idRaw = searchParams.get('id');
    const id = idRaw ? Number(idRaw) : null;

    const buildUrl = useCallback(
        (params) => {
            const next = new URLSearchParams(searchParams.toString());
            Object.entries(params).forEach(([key, value]) => {
                if (value === null || value === undefined || value === '') {
                    next.delete(key);
                } else {
                    next.set(key, String(value));
                }
            });
            const qs = next.toString();
            return qs ? `${pathname}?${qs}` : pathname;
        },
        [pathname, searchParams]
    );

    const openCreate = useCallback(() => {
        router.push(buildUrl({ modo: 'crear', id: null }), { scroll: true });
    }, [router, buildUrl]);

    const openEdit = useCallback(
        (recordId) => {
            router.push(buildUrl({ modo: 'editar', id: recordId }), { scroll: true });
        },
        [router, buildUrl]
    );

    const backToList = useCallback(() => {
        router.push(buildUrl({ modo: null, id: null }), { scroll: false });
    }, [router, buildUrl]);

    return useMemo(
        () => ({ mode, id, openCreate, openEdit, backToList }),
        [mode, id, openCreate, openEdit, backToList]
    );
}
