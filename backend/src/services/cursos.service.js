import { pool } from "../config/db.js";

/**
 * Crear curso
 */
export const crearCurso = async ({ nombre, descripcion, costo_mensual }) => {
    if (!nombre) {
        throw new Error("Nombre del curso es obligatorio");
    }

    const { rows } = await pool.query(`
    INSERT INTO cursos (nombre, descripcion, costo_mensual)
    VALUES ($1, $2, $3)
    RETURNING *
  `, [nombre, descripcion, costo_mensual]);

    return rows[0];
};

/**
 * Listar todos los cursos
 */
export const listarCursos = async () => {
    const { rows } = await pool.query(`
    SELECT * FROM cursos ORDER BY id DESC
  `);
    return rows;
};

/**
 * Obtener un curso específico
 */
export const obtenerCurso = async (id) => {
    const { rows } = await pool.query(
        "SELECT * FROM cursos WHERE id = $1",
        [id]
    );

    if (rows.length === 0) {
        throw new Error("Curso no encontrado");
    }

    return rows[0];
};

/**
 * Actualizar curso
 */
export const actualizarCurso = async (id, data) => {
    const { rows } = await pool.query(`
    UPDATE cursos
    SET nombre = COALESCE($1, nombre),
        descripcion = COALESCE($2, descripcion),
        costo_mensual = COALESCE($3, costo_mensual)
    WHERE id = $4
    RETURNING *
  `, [data.nombre, data.descripcion, data.costo_mensual, id]);

    if (rows.length === 0) {
        throw new Error("Curso no encontrado");
    }

    return rows[0];
};

/**
 * Eliminar curso
 */
export const eliminarCurso = async (id) => {
    const { rowCount } = await pool.query(
        "DELETE FROM cursos WHERE id = $1",
        [id]
    );

    if (rowCount === 0) {
        throw new Error("Curso no encontrado");
    }

    return { message: "Curso eliminado" };
};
