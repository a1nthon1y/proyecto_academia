import { pool } from "../config/db.js";

/* =========================
   PAGOS DE PADRES
========================= */

export const registrarPagoPadre = async ({
  padre_id,
  matricula_id,
  monto,
  metodo_pago,
  referencia
}) => {
  if (!padre_id || !matricula_id || !monto)
    throw new Error("Datos incompletos");

  // validar matrícula activa
  const matricula = await pool.query(`
    SELECT estado
    FROM matriculas
    WHERE id = $1
  `, [matricula_id]);

  if (matricula.rowCount === 0)
    throw new Error("Matrícula no existe");

  if (matricula.rows[0].estado !== 'ACTIVO')
    throw new Error("No se puede pagar una matrícula no activa");

  const { rows } = await pool.query(`
    INSERT INTO pagos_padres (
      padre_id, matricula_id, monto,
      metodo_pago, referencia, fecha_pago, estado
    )
    VALUES ($1,$2,$3,$4,$5,CURRENT_DATE,'PAGADO')
    RETURNING *
  `, [padre_id, matricula_id, monto, metodo_pago, referencia]);

  return rows[0];
};


export const listarPagosPadres = async () => {
  const { rows } = await pool.query(`
    SELECT p.id, p.fecha_pago, p.monto, p.estado,
           pa.nombres AS padre,
           al.nombres AS alumno
    FROM pagos_padres p
    JOIN padres pa ON pa.id = p.padre_id
    JOIN matriculas m ON m.id = p.matricula_id
    JOIN alumnos al ON al.id = m.alumno_id
    ORDER BY p.fecha_pago DESC
  `);
  return rows;
};

export const listarPagosPadre = async (usuarioId) => {
  const { rows } = await pool.query(`
    SELECT p.*
    FROM pagos_padres p
    JOIN padres pa ON pa.id = p.padre_id
    WHERE pa.usuario_id = $1
    ORDER BY p.fecha_pago DESC
  `, [usuarioId]);

  return rows;
};

/* =========================
   PAGOS A TUTORES
========================= */

/**
 * Registrar pago a tutor (alineado con schema de DB real)
 */
export const registrarPagoTutor = async ({
  tutor_id,
  contrato_id,
  monto,
  periodo, // Ej: "Enero 2026"
  fecha_pago
}) => {
  if (!tutor_id || !monto || !periodo) {
    throw new Error("Datos incompletos");
  }

  // Validar tutor
  const tutor = await pool.query(
    "SELECT 1 FROM tutores WHERE id = $1",
    [tutor_id]
  );

  if (tutor.rowCount === 0) {
    throw new Error("Tutor no existe");
  }

  // Validar contrato si se proporciona
  if (contrato_id) {
    const contrato = await pool.query(
      "SELECT 1 FROM contratos_tutores WHERE id = $1 AND tutor_id = $2",
      [contrato_id, tutor_id]
    );

    if (contrato.rowCount === 0) {
      throw new Error("Contrato no válido para este tutor");
    }
  }

  const { rows } = await pool.query(`
    INSERT INTO pagos_tutores (
      tutor_id, contrato_id, monto, periodo, fecha_pago, estado
    )
    VALUES ($1, $2, $3, $4, $5, 'PENDIENTE')
    RETURNING *
  `, [tutor_id, contrato_id, monto, periodo, fecha_pago || null]);

  return rows[0];
};

/**
 * Cambiar estado de pago a tutor
 */
export const cambiarEstadoPagoTutor = async (id, estado) => {
  const estadosValidos = ["PENDIENTE", "PAGADO", "CANCELADO"];

  if (!estadosValidos.includes(estado)) {
    throw new Error("Estado inválido");
  }

  const { rows } = await pool.query(`
    UPDATE pagos_tutores
    SET estado = $1
    WHERE id = $2
    RETURNING *
  `, [estado, id]);

  if (rows.length === 0) {
    throw new Error("Pago no encontrado");
  }

  return rows[0];
};

/**
 * Listar todos los pagos a tutores
 */
export const listarPagosTutores = async () => {
  const { rows } = await pool.query(`
    SELECT pt.*, 
           t.nombres || ' ' || t.apellidos AS tutor,
           ct.tipo_contrato
    FROM pagos_tutores pt
    JOIN tutores t ON t.id = pt.tutor_id
    LEFT JOIN contratos_tutores ct ON ct.id = pt.contrato_id
    ORDER BY pt.fecha_pago DESC
  `);

  return rows;
};
