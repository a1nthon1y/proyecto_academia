import { pool } from "../config/db.js";

/**
 * 📍 NUEVA LÓGICA: El TUTOR registra asistencias con su ubicación GPS
 * Los campos ubicacion_lat/lng son para verificar dónde está el TUTOR
 */
export const registrarPorTutor = async (usuarioId, {
  matricula_id,
  fecha,
  hora_llegada_tutor,
  ubicacion_lat,
  ubicacion_lng
}) => {
  // Validar que el usuario sea tutor
  const tutor = await pool.query(
    "SELECT id FROM tutores WHERE usuario_id = $1",
    [usuarioId]
  );

  if (tutor.rowCount === 0) {
    throw new Error("Tutor no válido");
  }

  // Validar que la matrícula pertenezca al tutor
  const matricula = await pool.query(`
    SELECT id FROM matriculas 
    WHERE id = $1 AND tutor_id = $2 AND estado = 'ACTIVO'
  `, [matricula_id, tutor.rows[0].id]);

  if (matricula.rowCount === 0) {
    throw new Error("Matrícula no válida para este tutor");
  }

  // Validar que se envíen las coordenadas (recomendado para verificación)
  if (!ubicacion_lat || !ubicacion_lng) {
    console.warn(`⚠️ Asistencia registrada sin ubicación para matrícula ${matricula_id}`);
  }

  // Insertar asistencia con ubicación del tutor
  const { rows } = await pool.query(`
    INSERT INTO asistencias (
      matricula_id, 
      fecha, 
      hora_llegada_tutor, 
      confirmado_tutor, 
      ubicacion_lat, 
      ubicacion_lng
    )
    VALUES ($1, $2, $3, true, $4, $5)
    RETURNING *
  `, [
    matricula_id,
    fecha || null,
    hora_llegada_tutor || null,
    ubicacion_lat,
    ubicacion_lng
  ]);

  return rows[0];
};

/**
 * Registro manual por ADMIN (para casos excepcionales)
 */
export const registrarPorAdmin = async ({
  matricula_id,
  fecha,
  hora_llegada_tutor,
  hora_confirmacion_padre,
  ubicacion_lat,
  ubicacion_lng
}) => {
  if (!matricula_id) {
    throw new Error("Matrícula es requerida");
  }

  const { rows } = await pool.query(`
    INSERT INTO asistencias (
      matricula_id,
      fecha,
      hora_llegada_tutor,
      hora_confirmacion_padre,
      confirmado_tutor,
      confirmado_padre,
      ubicacion_lat,
      ubicacion_lng
    )
    VALUES ($1, $2, $3, $4, true, true, $5, $6)
    RETURNING *
  `, [
    matricula_id,
    fecha || null,
    hora_llegada_tutor || null,
    hora_confirmacion_padre || null,
    ubicacion_lat,
    ubicacion_lng
  ]);

  return rows[0];
};

/**
 * Listar todas las asistencias (ADMIN/TRABAJADOR)
 * Incluye ubicación para verificación del trabajador
 */
export const listarAsistencias = async () => {
  const { rows } = await pool.query(`
    SELECT
      a.id,
      a.fecha,
      a.hora_llegada_tutor,
      a.hora_confirmacion_padre,
      a.confirmado_tutor,
      a.confirmado_padre,
      a.ubicacion_lat,
      a.ubicacion_lng,
      al.nombres || ' ' || al.apellidos AS alumno,
      p.nombres || ' ' || p.apellidos AS padre,
      t.nombres || ' ' || t.apellidos AS tutor,
      c.nombre AS curso
    FROM asistencias a
    JOIN matriculas m ON m.id = a.matricula_id
    JOIN alumnos al ON al.id = m.alumno_id
    JOIN padres p ON p.id = al.padre_id
    JOIN tutores t ON t.id = m.tutor_id
    JOIN cursos c ON c.id = m.curso_id
    ORDER BY a.fecha DESC, a.hora_llegada_tutor DESC NULLS LAST
  `);

  return rows;
};

/**
 * Listar asistencias de un tutor específico
 */
export const listarAsistenciasPorTutor = async (usuarioId) => {
  const tutor = await pool.query(
    "SELECT id FROM tutores WHERE usuario_id = $1",
    [usuarioId]
  );

  if (tutor.rowCount === 0) {
    throw new Error("Tutor no válido");
  }

  const { rows } = await pool.query(`
    SELECT
      a.id,
      a.fecha,
      a.hora_llegada_tutor,
      a.ubicacion_lat,
      a.ubicacion_lng,
      al.nombres || ' ' || al.apellidos AS alumno,
      c.nombre AS curso,
      m.direccion_clases
    FROM asistencias a
    JOIN matriculas m ON m.id = a.matricula_id
    JOIN alumnos al ON al.id = m.alumno_id
    JOIN cursos c ON c.id = m.curso_id
    WHERE m.tutor_id = $1
    ORDER BY a.fecha DESC
  `, [tutor.rows[0].id]);

  return rows;
};

/**
 * Listar asistencias de un padre específico (solo lectura)
 */
export const listarAsistenciasPorPadre = async (usuarioId) => {
  const padre = await pool.query(
    "SELECT id FROM padres WHERE usuario_id = $1",
    [usuarioId]
  );

  if (padre.rowCount === 0) {
    throw new Error("Padre no válido");
  }

  const { rows } = await pool.query(`
    SELECT
      a.id,
      a.fecha,
      a.hora_llegada_tutor,
      a.confirmado_tutor,
      al.nombres || ' ' || al.apellidos AS alumno,
      t.nombres || ' ' || t.apellidos AS tutor,
      c.nombre AS curso
    FROM asistencias a
    JOIN matriculas m ON m.id = a.matricula_id
    JOIN alumnos al ON al.id = m.alumno_id
    JOIN tutores t ON t.id = m.tutor_id
    JOIN cursos c ON c.id = m.curso_id
    WHERE al.padre_id = $1
    ORDER BY a.fecha DESC
  `, [padre.rows[0].id]);

  return rows;
};
