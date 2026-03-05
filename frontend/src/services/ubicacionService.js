
import { makeGetRequest } from '@/utils/api';

// Listar todas las ciudades
export async function listarCiudades() {
    return await makeGetRequest('/api/ciudades');
}

// Listar distritos por ciudad
export async function listarDistritosPorCiudad(ciudadId) {
    return await makeGetRequest(`/api/distritos/ciudad/${ciudadId}`);
}
