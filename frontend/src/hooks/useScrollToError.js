import { useEffect } from 'react';

/**
 * Hace scroll suave al primer campo con error después de un submit fallido.
 * Útil cuando el formulario es largo y el usuario puede no ver dónde está el error.
 *
 * Uso:
 *   useScrollToError(errors, isSubmitted);
 */
export function useScrollToError(errors, isSubmitted) {
  useEffect(() => {
    if (!isSubmitted) return;
    const firstErrorKey = Object.keys(errors || {})[0];
    if (!firstErrorKey) return;

    // RHF expone aria-invalid en los inputs con error.
    // Buscamos el primer input inválido y le hacemos scroll.
    const el =
      document.querySelector(`[name="${firstErrorKey}"]`) ||
      document.querySelector('[aria-invalid="true"]');

    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      // Pequeño delay para que el scroll termine antes del focus
      setTimeout(() => {
        if (typeof el.focus === 'function') el.focus({ preventScroll: true });
      }, 350);
    }
  }, [errors, isSubmitted]);
}
