import * as logsService from "../services/logs.service.js";

/**
 * Listar logs del sistema (SOLO ADMIN)
 */
export const listarLogs = async (req, res) => {
    try {
        const filtros = {
            usuario_id: req.query.usuario_id,
            fecha_desde: req.query.fecha_desde,
            fecha_hasta: req.query.fecha_hasta,
            limit: req.query.limit ? parseInt(req.query.limit) : 100,
        };

        const logs = await logsService.listarLogs(filtros);
        res.json(logs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * Obtener estadísticas de logs (SOLO ADMIN)
 */
export const obtenerEstadisticas = async (req, res) => {
    try {
        const stats = await logsService.obtenerEstadisticasLogs();
        res.json(stats);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
