import { pool } from "../config/db.js";


export const obtenerPerfil = async (usuarioId) => {
  const { rows } = await pool.query(`
    SELECT p.id, p.nombres, p.apellidos, p.telefono,
           u.email
    FROM padres p
    JOIN usuarios u ON u.id = p.usuario_id
    WHERE u.id = $1
  `, [usuarioId]);

  if (rows.length === 0)
    throw new Error("Padre no encontrado");

  return rows[0];
};


// ELIMINAR PADRE (Soft Delete Usuario)
export const eliminarPadre = async (id) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Obtener usuario_id
    const padre = await client.query("SELECT usuario_id FROM padres WHERE id = $1", [id]);
    if (padre.rowCount === 0) throw new Error("Padre no encontrado");

    const usuarioId = padre.rows[0].usuario_id;

    // Desactivar usuario
    await client.query("UPDATE usuarios SET activo = false WHERE id = $1", [usuarioId]);

    await client.query('COMMIT');
    return { message: "Padre eliminado correctamente" };

  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

export const listarPadres = async () => {
  const { rows } = await pool.query(`
      SELECT 
        p.id,
        p.nombres,
        p.apellidos,
        p.telefono,
        p.dni,
        u.id AS usuario_id,
        u.email,
        u.activo,
        u.creado_en
      FROM padres p
      JOIN usuarios u ON u.id = p.usuario_id
      WHERE u.activo = true 
      ORDER BY p.id DESC
    `);

  return rows;
};

export const listarMisTutores = async (usuarioId) => {
  const { rows } = await pool.query(`
    SELECT DISTINCT
      t.id,
      t.nombres,
      t.apellidos,
      t.telefono,
      u.email,
      a.id AS alumno_id,
      a.nombres || ' ' || a.apellidos AS alumno
    FROM matriculas m
    JOIN alumnos a ON a.id = m.alumno_id
    JOIN padres p ON p.id = a.padre_id
    JOIN tutores t ON t.id = m.tutor_id
    JOIN usuarios u ON u.id = t.usuario_id
    WHERE p.usuario_id = $1
      AND m.estado = 'ACTIVO'
    ORDER BY t.apellidos
  `, [usuarioId]);

  return rows;
};

export const listarHijos = async (usuarioId) => {
  const { rows } = await pool.query(`
    SELECT 
      a.id,
      a.nombres,
      a.apellidos,
      a.dni,
      a.grado,
      a.nivel_id,
      n.nombre as nivel,
      c.nombre as ciudad
    FROM alumnos a
    JOIN padres p ON p.id = a.padre_id
    LEFT JOIN niveles n ON n.id = a.nivel_id
    LEFT JOIN ciudades c ON c.id = a.ciudad_id
    WHERE p.usuario_id = $1 AND a.activo = true
  `, [usuarioId]);

  return rows;
};

export const listarAsistencias = async (usuarioId) => {
  // Obtener asistencias de todos los hijos del padre
  const { rows } = await pool.query(`
    SELECT 
      asist.id,
      asist.fecha,
      asist.estado,
      asist.observacion,
      a.nombres || ' ' || a.apellidos as alumno,
      t.nombres || ' ' || t.apellidos as tutor,
      c.nombre as curso
    FROM asistencia_detalles ad
    JOIN asistencias asist ON asist.id = ad.asistencia_id
    JOIN alumnos a ON a.id = ad.alumno_id
    JOIN padres p ON p.id = a.padre_id
    LEFT JOIN matriculas m ON m.alumno_id = a.id AND m.estado = 'ACTIVO' -- Opcional: Vincular con matrícula actual
    LEFT JOIN tutores t ON t.id = asist.tutor_id
    LEFT JOIN cursos c ON c.id = m.curso_id -- Si la asistencia está ligada a un curso/clase
    WHERE p.usuario_id = $1
    ORDER BY asist.fecha DESC
  `, [usuarioId]);

  /* 
     NOTA: La consulta anterior es una aproximación generica. 
     Dependiendo de cómo esté estructurada la tabla 'asistencias' y 'asistencia_detalles' 
     (si es que existen, o si es una sola tabla), esto podría variar.
     Asumiré una estructura simple basada en lo común: 'asistencias' vincula tutor/fecha, 
     y 'asistencia_detalles' vincula alumno/estado.
     
     Si la tabla es simple (una fila por asistencia de alumno):
  */

  return rows;
};