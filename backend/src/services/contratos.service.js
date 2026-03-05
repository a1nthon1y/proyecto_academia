import { pool } from "../config/db.js";

/**
 * Crear contrato de tutor
 */
export const crearContrato = async ({
    tutor_id,
    tipo_contrato,
    pago_por_hora,
    fecha_inicio,
    fecha_fin
}) => {
    if (!tutor_id || !tipo_contrato) {
        throw new Error("Datos incompletos");
    }

    // Validar tutor existe
    const tutor = await pool.query(
        "SELECT 1 FROM tutores WHERE id = $1",
        [tutor_id]
    );

    if (tutor.rowCount === 0) {
        throw new Error("Tutor no existe");
    }

    // Validar fechas si ambas están presentes
    if (fecha_inicio && fecha_fin && fecha_fin < fecha_inicio) {
        throw new Error("La fecha fin no puede ser menor a la fecha inicio");
    }

    const { rows } = await pool.query(`
    INSERT INTO contratos_tutores (
      tutor_id, tipo_contrato, pago_por_hora, fecha_inicio, fecha_fin
    )
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *
  `, [tutor_id, tipo_contrato, pago_por_hora, fecha_inicio, fecha_fin]);

    return rows[0];
};

/**
 * Listar todos los contratos
 */
export const listarContratos = async () => {
    const { rows } = await pool.query(`
    SELECT ct.*, t.nombres || ' ' || t.apellidos AS tutor
    FROM contratos_tutores ct
    JOIN tutores t ON t.id = ct.tutor_id
    ORDER BY ct.id DESC
  `);
    return rows;
};

/**
 * Obtener contrato específico
 */
export const obtenerContrato = async (id) => {
    const { rows } = await pool.query(`
    SELECT ct.*, t.nombres || ' ' || t.apellidos AS tutor
    FROM contratos_tutores ct
    JOIN tutores t ON t.id = ct.tutor_id
    WHERE ct.id = $1
  `, [id]);

    if (rows.length === 0) {
        throw new Error("Contrato no encontrado");
    }

    return rows[0];
};

/**
 * Actualizar contrato
 */
export const actualizarContrato = async (id, data) => {
    // Validar fechas si ambas están presentes
    if (data.fecha_inicio && data.fecha_fin && data.fecha_fin < data.fecha_inicio) {
        throw new Error("La fecha fin no puede ser menor a la fecha inicio");
    }

    const { rows } = await pool.query(`
    UPDATE contratos_tutores
    SET tipo_contrato = COALESCE($1, tipo_contrato),
        pago_por_hora = COALESCE($2, pago_por_hora),
        fecha_inicio = COALESCE($3, fecha_inicio),
        fecha_fin = COALESCE($4, fecha_fin)
    WHERE id = $5
    RETURNING *
  `, [data.tipo_contrato, data.pago_por_hora, data.fecha_inicio,
    data.fecha_fin, id]);

    if (rows.length === 0) {
        throw new Error("Contrato no encontrado");
    }

    return rows[0];
};

/**
 * Listar contratos de un tutor específico
 */
export const listarContratosPorTutor = async (tutorId) => {
    const { rows } = await pool.query(`
    SELECT *
    FROM contratos_tutores
    WHERE tutor_id = $1
    ORDER BY fecha_inicio DESC
  `, [tutorId]);

    return rows;
};
