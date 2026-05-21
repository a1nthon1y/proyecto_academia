import { pool } from "../config/db.js";




/**
 * Desactivar tutor (soft delete).
 * Devuelve también la cantidad de matrículas activas asociadas
 * para que el frontend pueda advertir al usuario.
 */
export const desactivarTutor = async (id) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const tutor = await client.query("SELECT usuario_id FROM tutores WHERE id = $1", [id]);
    if (tutor.rowCount === 0) throw new Error("Tutor no encontrado");

    const matriculasActivas = await client.query(
      "SELECT COUNT(*) AS total FROM matriculas WHERE tutor_id = $1 AND estado = 'ACTIVO'",
      [id]
    );
    const totalActivas = parseInt(matriculasActivas.rows[0].total, 10);

    await client.query("UPDATE usuarios SET activo = false WHERE id = $1", [tutor.rows[0].usuario_id]);

    await client.query('COMMIT');
    return {
      message: "Tutor desactivado",
      matriculas_activas: totalActivas,
    };
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

// Alias retro-compatible: el endpoint sigue siendo DELETE /tutores/:id pero
// ahora hace soft-delete explícitamente
export const eliminarTutor = desactivarTutor;

/**
 * Reactivar un tutor desactivado
 */
export const reactivarTutor = async (id) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const tutor = await client.query("SELECT usuario_id FROM tutores WHERE id = $1", [id]);
    if (tutor.rowCount === 0) throw new Error("Tutor no encontrado");

    await client.query("UPDATE usuarios SET activo = true WHERE id = $1", [tutor.rows[0].usuario_id]);

    await client.query('COMMIT');
    return { message: "Tutor reactivado" };
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

export const listarTutores = async ({ incluirInactivos = false } = {}) => {
  const { rows } = await pool.query(`
    SELECT t.id, t.dni, t.nombres, t.apellidos, t.telefono, t.direccion,
           t.especialidad, t.nivel_id,
           c.nombre AS ciudad, d.nombre AS distrito,
           n.nombre AS nivel, u.email, u.activo
    FROM tutores t
    JOIN usuarios u ON u.id = t.usuario_id
    LEFT JOIN ciudades c ON c.id = t.ciudad_id
    LEFT JOIN distritos d ON d.id = t.distrito_id
    LEFT JOIN niveles n ON n.id = t.nivel_id
    ${incluirInactivos ? '' : 'WHERE u.activo = true'}
    ORDER BY u.activo DESC, t.id DESC
  `);
  return rows;
};

export const obtenerTutor = async (id) => {
  const { rows } = await pool.query(`
    SELECT t.*, u.email, u.activo,
           c.nombre AS ciudad, d.nombre AS distrito, 
           b.nombre AS banco, n.nombre AS nivel
    FROM tutores t
    JOIN usuarios u ON u.id = t.usuario_id
    LEFT JOIN ciudades c ON c.id = t.ciudad_id
    LEFT JOIN distritos d ON d.id = t.distrito_id
    LEFT JOIN bancos b ON b.id = t.banco_id
    LEFT JOIN niveles n ON n.id = t.nivel_id
    WHERE t.id = $1 AND u.activo = true
  `, [id]);

  if (rows.length === 0) throw new Error("Tutor no encontrado");
  return rows[0];
};

export const obtenerTutorPorUsuario = async (usuarioId) => {
  const { rows } = await pool.query(`
    SELECT t.*, u.email, u.activo,
           c.nombre AS ciudad, d.nombre AS distrito, n.nombre AS nivel
    FROM tutores t
    JOIN usuarios u ON u.id = t.usuario_id
    LEFT JOIN ciudades c ON c.id = t.ciudad_id
    LEFT JOIN distritos d ON d.id = t.distrito_id
    LEFT JOIN niveles n ON n.id = t.nivel_id
    WHERE t.usuario_id = $1
  `, [usuarioId]);

  if (rows.length === 0)
    throw new Error("Tutor no encontrado");

  return rows[0];
};

export const actualizarTutor = async (id, data) => {
  const existe = await pool.query(
    "SELECT 1 FROM tutores WHERE id = $1",
    [id]
  );

  if (existe.rowCount === 0)
    throw new Error("Tutor no existe");

  const { rows } = await pool.query(`
    UPDATE tutores
    SET nombres = COALESCE($1, nombres),
        apellidos = COALESCE($2, apellidos),
        telefono = COALESCE($3, telefono),
        direccion = COALESCE($4, direccion),
        especialidad = COALESCE($5, especialidad),
        nivel_id = COALESCE($6, nivel_id),
        ciudad_id = COALESCE($7, ciudad_id),
        distrito_id = COALESCE($8, distrito_id),
        tarifa_por_sesion = COALESCE($9, tarifa_por_sesion),
        banco_id = COALESCE($10, banco_id),
        cuenta_bancaria = COALESCE($11, cuenta_bancaria)
    WHERE id = $12
    RETURNING *
  `, [
    data.nombres,
    data.apellidos,
    data.telefono,
    data.direccion,
    data.especialidad,
    data.nivel_id,
    data.ciudad_id,
    data.distrito_id,
    data.tarifa_por_sesion,
    data.banco_id,
    data.cuenta_bancaria,
    id
  ]);

  return rows[0];
};

/**
 * Listar disponibilidad semanal de un tutor + carga actual (matrículas activas)
 */
export const listarDisponibilidad = async (tutorId) => {
  const [dispResult, cargaResult] = await Promise.all([
    pool.query(
      `SELECT id, dia_semana, hora_inicio, hora_fin
       FROM tutor_disponibilidad
       WHERE tutor_id = $1
       ORDER BY
         CASE dia_semana
           WHEN 'LUNES'     THEN 1
           WHEN 'MARTES'    THEN 2
           WHEN 'MIERCOLES' THEN 3
           WHEN 'JUEVES'    THEN 4
           WHEN 'VIERNES'   THEN 5
           WHEN 'SABADO'    THEN 6
           WHEN 'DOMINGO'   THEN 7
           ELSE 8
         END,
         hora_inicio`,
      [tutorId]
    ),
    pool.query(
      `SELECT COUNT(*) AS total
       FROM matriculas
       WHERE tutor_id = $1 AND estado = 'ACTIVO'`,
      [tutorId]
    ),
  ]);

  return {
    disponibilidad: dispResult.rows,
    matriculas_activas: parseInt(cargaResult.rows[0].total, 10),
  };
};

export const registrarDisponibilidad = async (tutorId, {
  dia_semana,
  hora_inicio,
  hora_fin
}) => {
  if (!dia_semana || !hora_inicio || !hora_fin)
    throw new Error("Datos de disponibilidad incompletos");

  const { rows } = await pool.query(`
    INSERT INTO tutor_disponibilidad (
      tutor_id, dia_semana, hora_inicio, hora_fin
    )
    VALUES ($1,$2,$3,$4)
    RETURNING *
  `, [tutorId, dia_semana, hora_inicio, hora_fin]);

  return rows[0];
};
