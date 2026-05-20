import { makeGetRequest, makePostRequest } from '@/utils/api';

/* ============ PAGOS DE PADRES ============ */

export async function listarPagosPadres() {
  return await makeGetRequest('/api/pagos/padres');
}

export async function registrarPagoPadre(data) {
  return await makePostRequest('/api/pagos/padres', data);
}

export async function listarMisPagosPadre() {
  return await makeGetRequest('/api/pagos/padres/mis-pagos');
}

/* ============ PAGOS A TUTORES ============ */

export async function listarPagosTutores() {
  return await makeGetRequest('/api/pagos/tutores');
}

export async function generarPagosTutores(periodo) {
  return await makePostRequest('/api/pagos/tutores/generar', { periodo });
}

export async function pagarTutor(data) {
  return await makePostRequest('/api/pagos/tutores/pagar', data);
}
