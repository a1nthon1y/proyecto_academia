/**
 * Util compartido para previsualizar el username que generará el backend
 * a partir de nombre + apellido + rol.
 *
 * Debe mantenerse sincronizado con backend/src/utils/generarUsername.js
 *   prefijo: a=ADMIN, w=TRABAJADOR, p=PADRE, t=TUTOR
 *   inicial del primer nombre + primer apellido (sin tildes, sin espacios)
 *
 * Ejemplo: { nombres: "Ana María", apellidos: "López Pérez", rolId: 3 }
 *          → "palopez"
 */

const PREFIJOS = { 1: 'a', 2: 'w', 3: 'p', 4: 't' };

const limpiar = (txt) =>
  (txt || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '');

/**
 * @param {Object} args
 * @param {string} args.nombres
 * @param {string} args.apellidos
 * @param {number} args.rolId  - 1=ADMIN, 2=TRABAJADOR, 3=PADRE, 4=TUTOR
 * @returns {string} preview del username o '' si faltan datos
 */
export function previewUsername({ nombres, apellidos, rolId }) {
  if (!nombres || !apellidos || !rolId) return '';
  const prefijo = PREFIJOS[rolId];
  if (!prefijo) return '';
  const inicial = limpiar(nombres)[0] || '';
  const primerApellido = limpiar((apellidos || '').split(' ')[0]);
  if (!inicial || !primerApellido) return '';
  return `${prefijo}${inicial}${primerApellido}`;
}
