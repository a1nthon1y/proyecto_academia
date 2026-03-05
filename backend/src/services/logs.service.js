import { pool } from "../config/db.js";

/**
 * Registra una acción en el sistema de logs
 * Solo se registran acciones de ADMIN y TRABAJADOR
 */
export const registrarLog = async (usuarioId, accion) => {
  try {
    await pool.query(`
      INSERT INTO logs_sistema (usuario_id, accion)
      VALUES ($1, $2)
    `, [usuarioId, accion]);
  } catch (error) {
    console.error('Error al registrar log:', error);
    // No lanzar error para no interrumpir la operación principal
  }
};

/**
 * Listar logs del sistema (SOLO ADMIN)
 */
export const listarLogs = async (filtros = {}) => {
  const { usuario_id, fecha_desde, fecha_hasta, limit = 100 } = filtros;

  let query = `
    SELECT 
      l.id, 
      l.accion, 
      l.fecha,
      COALESCE(u.email, 'SISTEMA') as email,
      COALESCE(u.username, 'SISTEMA') as username,
      COALESCE(r.nombre, 'SYSTEM') AS rol
    FROM logs_sistema l
    LEFT JOIN usuarios u ON u.id = l.usuario_id
    LEFT JOIN roles r ON r.id = u.rol_id
    WHERE 1=1
  `;

  const params = [];

  if (usuario_id) {
    params.push(usuario_id);
    query += ` AND l.usuario_id = $${params.length}`;
  }

  if (fecha_desde) {
    params.push(fecha_desde);
    query += ` AND l.fecha >= $${params.length}`;
  }

  if (fecha_hasta) {
    params.push(fecha_hasta);
    query += ` AND l.fecha <= $${params.length}`;
  }

  params.push(limit);
  query += ` ORDER BY l.fecha DESC LIMIT $${params.length}`;

  const { rows } = await pool.query(query, params);
  return rows;
};

/**
 * Obtener estadísticas de logs (SOLO ADMIN)
 */
export const obtenerEstadisticasLogs = async () => {
  const { rows } = await pool.query(`
    SELECT 
      COALESCE(r.nombre, 'SYSTEM') AS rol,
      COUNT(*) AS total_acciones,
      MAX(l.fecha) AS ultima_accion
    FROM logs_sistema l
    LEFT JOIN usuarios u ON u.id = l.usuario_id
    LEFT JOIN roles r ON r.id = u.rol_id
    GROUP BY r.nombre
    ORDER BY total_acciones DESC
  `);

  return rows;
};
