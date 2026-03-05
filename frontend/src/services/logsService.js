import { makeGetRequest, makeDeleteRequest } from '@/utils/api';

/**
 * Listar logs del sistema (SOLO ADMIN)
 * GET /api/logs
 */
export async function listarLogs(filtros = {}) {
    const params = new URLSearchParams();

    if (filtros.usuario_id) params.append('usuario_id', filtros.usuario_id);
    if (filtros.fecha_desde) params.append('fecha_desde', filtros.fecha_desde);
    if (filtros.fecha_hasta) params.append('fecha_hasta', filtros.fecha_hasta);
    if (filtros.limit) params.append('limit', filtros.limit);

    const query = params.toString();
    return await makeGetRequest(`/api/logs${query ? `?${query}` : ''}`);
}

/**
 * Obtener estadísticas de logs (SOLO ADMIN)
 * GET /api/logs/estadisticas
 */
export async function obtenerEstadisticasLogs() {
    return await makeGetRequest('/api/logs/estadisticas');
}
