import { pool } from "../config/db.js";

export const crearMatricula = async ({
  alumno_id,
  tutor_id,
  curso_id,
  direccion_clases,
  fecha_inicio,
  fecha_fin
}) => {

  if (!alumno_id || !curso_id)
    throw new Error("Datos incompletos: Alumno y Curso son obligatorios");

  // Validar que alumno existe
  const alumno = await pool.query(
    "SELECT 1 FROM alumnos WHERE id = $1",
    [alumno_id]
  );
  if (alumno.rowCount === 0)
    throw new Error("Alumno no existe");

  // Validar que alumno NO tiene matrícula activa
  const activa = await pool.query(
    "SELECT 1 FROM matriculas WHERE alumno_id = $1 AND estado = 'ACTIVO'",
    [alumno_id]
  );
  if (activa.rowCount > 0)
    throw new Error("El alumno ya tiene una matrícula activa");

  // Validar tutor SI SE ENVÍA
  if (tutor_id) {
    const tutor = await pool.query(`
      SELECT 1 
      FROM tutores t
      JOIN usuarios u ON u.id = t.usuario_id
      WHERE t.id = $1 AND u.activo = true
    `, [tutor_id]);
    if (tutor.rowCount === 0)
      throw new Error("Tutor no disponible o inactivo");
  }

  // Validar que curso existe
  const curso = await pool.query(
    "SELECT 1 FROM cursos WHERE id = $1",
    [curso_id]
  );
  if (curso.rowCount === 0)
    throw new Error("Curso no existe");

  // Validación de fechas
  if (fecha_fin && fecha_inicio && fecha_fin < fecha_inicio) {
    throw new Error("La fecha fin no puede ser menor a la fecha inicio");
  }

  // Estado inicial: Si hay tutor es ACTIVO, sino PENDIENTE
  const estadoInicial = tutor_id ? 'ACTIVO' : 'PENDIENTE';

  const { rows } = await pool.query(`
    INSERT INTO matriculas (
      alumno_id,
      tutor_id,
      curso_id,
      direccion_clases,
      fecha_inicio,
      fecha_fin,
      estado
    )
    VALUES ($1,$2,$3,$4,$5,$6,$7)
    RETURNING *
  `, [
    alumno_id,
    tutor_id || null, // Asegurar NULL si no viene
    curso_id,
    direccion_clases,
    fecha_inicio,
    fecha_fin,
    estadoInicial
  ]);

  return rows[0];
};


export const listarMatriculas = async () => {
  const { rows } = await pool.query(`
    SELECT 
      m.id, 
      m.estado,
      m.fecha_inicio,
      m.fecha_fin,
      m.direccion_clases,
      m.alumno_id,
      al.nombres || ' ' || al.apellidos AS alumno,
      al.dni AS alumno_dni,
      al.nivel_id AS alumno_nivel_id,
      n.nombre AS alumno_nivel,
      m.tutor_id,
      t.nombres || ' ' || t.apellidos AS tutor,
      u.email AS tutor_email,
      t.telefono AS tutor_telefono,
      t.especialidad AS tutor_especialidad,
      m.curso_id,  
      c.nombre AS curso,
      c.descripcion AS curso_descripcion,
      c.costo_mensual AS curso_costo,
      p.nombres || ' ' || p.apellidos AS padre,
      up.email AS padre_email,
      u.activo AS tutor_activo
    FROM matriculas m
    JOIN alumnos al ON al.id = m.alumno_id
    JOIN tutores t ON t.id = m.tutor_id
    JOIN cursos c ON c.id = m.curso_id
    JOIN padres p ON p.id = al.padre_id
    JOIN usuarios u ON u.id = t.usuario_id
    JOIN usuarios up ON up.id = p.usuario_id
    LEFT JOIN niveles n ON n.id = al.nivel_id
    ORDER BY m.id DESC
  `);

  return rows;
};

export const obtenerMatricula = async (id) => {
  const { rows } = await pool.query(`
    SELECT 
      m.*,
      al.nombres || ' ' || al.apellidos AS alumno_nombre,
      al.dni AS alumno_dni,
      al.nivel_id,
      n.nombre AS nivel_nombre,
      t.nombres || ' ' || t.apellidos AS tutor_nombre,
      u.email AS tutor_email,
      t.telefono AS tutor_telefono,
      t.especialidad AS tutor_especialidad,
      c.nombre AS curso_nombre,
      c.descripcion AS curso_descripcion,
      c.costo_mensual,
      p.nombres || ' ' || p.apellidos AS padre_nombre,
      p.telefono AS padre_telefono,
      up.email AS padre_email
    FROM matriculas m
    LEFT JOIN alumnos al ON al.id = m.alumno_id
    LEFT JOIN tutores t ON t.id = m.tutor_id
    LEFT JOIN cursos c ON c.id = m.curso_id
    LEFT JOIN padres p ON p.id = al.padre_id
    LEFT JOIN usuarios u ON u.id = t.usuario_id
    LEFT JOIN usuarios up ON up.id = p.usuario_id
    LEFT JOIN niveles n ON n.id = al.nivel_id
    WHERE m.id = $1
  `, [id]);

  if (rows.length === 0)
    throw new Error("Matrícula no encontrada");

  return rows[0];
};

export const actualizarMatricula = async (id, data) => {
  // 1. Obtener matrícula actual para verificar estado y fechas
  const current = await pool.query("SELECT estado, fecha_fin FROM matriculas WHERE id = $1", [id]);

  if (current.rowCount === 0) {
    throw new Error("Matrícula no encontrada");
  }

  const matActual = current.rows[0];
  let nuevoEstado = matActual.estado;

  // 2. Si se actualiza la fecha fin y es futura, reactivar si estaba finalizada
  if (data.fecha_fin) {
    const nuevaFechaFin = new Date(data.fecha_fin);
    const hoy = new Date();

    // Si la nueva fecha es futura y el estado era FINALIZADO, reactivar
    if (nuevaFechaFin > hoy && matActual.estado === 'FINALIZADO') {
      nuevoEstado = 'ACTIVO';
    }
  }

  const { rows } = await pool.query(`
    UPDATE matriculas
    SET tutor_id = COALESCE($1, tutor_id),
        curso_id = COALESCE($2, curso_id),
        direccion_clases = COALESCE($3, direccion_clases),
        fecha_fin = COALESCE($4, fecha_fin),
        estado = $5
    WHERE id = $6
    RETURNING *
  `, [
    data.tutor_id,
    data.curso_id,
    data.direccion_clases,
    data.fecha_fin,
    nuevoEstado,
    id
  ]);

  return rows[0];
};


export const cambiarEstado = async (id, estado) => {
  const estadosValidos = ["ACTIVO", "FINALIZADO", "CANCELADO"];

  if (!estadosValidos.includes(estado))
    throw new Error("Estado inválido");

  const { rows } = await pool.query(`
    UPDATE matriculas
    SET estado = $1
    WHERE id = $2
    RETURNING *
  `, [estado, id]);

  if (rows.length === 0)
    throw new Error("Matrícula no encontrada");

  return rows[0];
};

export const listarMatriculasPorTutor = async (usuarioId) => {
  const tutor = await pool.query(
    "SELECT id FROM tutores WHERE usuario_id = $1",
    [usuarioId]
  );

  if (tutor.rowCount === 0) {
    throw new Error("Tutor no encontrado o no tiene permiso");
  }

  const { rows } = await pool.query(`
    SELECT 
      m.id, 
      m.estado,
      m.direccion_clases,
      m.alumno_id,
      al.nombres || ' ' || al.apellidos AS alumno,
      al.dni AS alumno_dni,
      m.curso_id,
      c.nombre AS curso
    FROM matriculas m
    JOIN alumnos al ON al.id = m.alumno_id
    JOIN cursos c ON c.id = m.curso_id
    WHERE m.tutor_id = $1 AND m.estado = 'ACTIVO'
    ORDER BY m.id DESC
  `, [tutor.rows[0].id]);

  return rows;
};
