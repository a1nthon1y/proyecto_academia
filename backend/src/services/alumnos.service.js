import { pool } from "../config/db.js";

/**
 * Crear alumno
 */
export const crearAlumno = async ({
  dni,
  nombres,
  apellidos,
  fecha_nacimiento,
  padre_id,
  grado,
  nivel_id,
  ciudad_id,
  distrito_id
}) => {
  if (!dni || !nombres || !apellidos || !padre_id) {
    throw new Error("Datos obligatorios incompletos");
  }

  // Validar que el padre exista
  const padre = await pool.query(
    "SELECT id FROM padres WHERE id = $1",
    [padre_id]
  );

  if (padre.rowCount === 0) {
    throw new Error("El padre no existe");
  }

  const { rows } = await pool.query(
    `
    INSERT INTO alumnos (
      dni,
      nombres,
      apellidos,
      fecha_nacimiento,
      padre_id,
      grado,
      nivel_id,
      ciudad_id,
      distrito_id
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    RETURNING *
    `,
    [
      dni.trim(),
      nombres.trim(),
      apellidos.trim(),
      fecha_nacimiento || null,
      padre_id,
      grado ? grado.trim() : null,
      nivel_id || null,
      ciudad_id || null,
      distrito_id || null
    ]
  );

  return rows[0];
};

// Listar alumnos activos
export const listarAlumnos = async () => {
  const { rows } = await pool.query(
    `
    SELECT 
      a.id,
      a.dni,
      a.nombres,
      a.apellidos,
      a.fecha_nacimiento,
      a.grado,
      p.nombres || ' ' || p.apellidos AS padre,
      c.nombre AS ciudad,
      d.nombre AS distrito
    FROM alumnos a
    JOIN padres p ON p.id = a.padre_id
    LEFT JOIN ciudades c ON c.id = a.ciudad_id
    LEFT JOIN distritos d ON d.id = a.distrito_id
    WHERE a.activo = true
    ORDER BY a.id DESC
    `
  );

  return rows;
};

/**
 * Obtener alumno por ID
 */
export const obtenerAlumno = async (id) => {
  const { rows } = await pool.query(
    `
    SELECT 
      a.*,
      p.nombres || ' ' || p.apellidos AS padre
    FROM alumnos a
    JOIN padres p ON p.id = a.padre_id
    WHERE a.id = $1 AND a.activo = true
    `,
    [id]
  );

  if (rows.length === 0) {
    throw new Error("Alumno no encontrado");
  }

  return rows[0];
};

/**
 * Actualizar alumno
 */
export const actualizarAlumno = async (id, data) => {
  const permitidos = [
    "nombres",
    "apellidos",
    "fecha_nacimiento",
    "dni",
    "padre_id",
    "grado",
    "nivel_id",
    "ciudad_id",
    "distrito_id"
  ];

  const campos = [];
  const valores = [];
  let i = 1;

  for (const key of permitidos) {
    if (data[key] !== undefined) {
      if (
        typeof data[key] === "string" &&
        data[key].trim() === ""
      ) {
        throw new Error(`El campo ${key} no puede estar vacío`);
      }

      campos.push(`${key} = $${i}`);
      valores.push(
        typeof data[key] === "string" ? data[key].trim() : data[key]
      );
      i++;
    }
  }

  if (campos.length === 0) {
    throw new Error("No hay datos válidos para actualizar");
  }

  const { rows, rowCount } = await pool.query(
    `
    UPDATE alumnos
    SET ${campos.join(", ")}
    WHERE id = $${i}
    RETURNING *
    `,
    [...valores, id]
  );

  if (rowCount === 0) {
    throw new Error("Alumno no encontrado");
  }

  return rows[0];
};

export const eliminarAlumno = async (id) => {
  await pool.query(
    "UPDATE alumnos SET activo = false WHERE id = $1",
    [id]
  );
};
