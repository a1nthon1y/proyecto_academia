import { makeGetRequest, makePostRequest, makePutRequest } from '@/utils/api';

/**
 * Listar todos los contratos (ADMIN/TRABAJADOR)
 */
export async function listarContratos() {
    return await makeGetRequest('/api/contratos');
}

/**
 * Obtener un contrato específico
 */
export async function obtenerContrato(id) {
    return await makeGetRequest(`/api/contratos/${id}`);
}

/**
 * Crear contrato (ADMIN/TRABAJADOR)
 */
export async function crearContrato(data) {
    return await makePostRequest('/api/contratos', data);
}

/**
 * Actualizar contrato (ADMIN/TRABAJADOR)
 */
export async function actualizarContrato(id, data) {
    return await makePutRequest(`/api/contratos/${id}`, data);
}
