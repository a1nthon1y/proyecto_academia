
import { makeGetRequest } from '@/utils/api';

// Listar todos los niveles
export async function listarNiveles() {
    return await makeGetRequest('/api/niveles');
}
