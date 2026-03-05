import { pool } from "../config/db.js";

export const crearConsulta = async ({
  nombres,
  telefono,
  email,
  mensaje,
  origen = "WEB"
}) => {

  if (!nombres || !telefono || !mensaje)
    throw new Error("Datos incompletos");

  const { rows } = await pool.query(`
    INSERT INTO consultas (
      nombres, telefono, email, mensaje,
      origen, estado, fecha_registro
    )
    VALUES ($1,$2,$3,$4,$5,'PENDIENTE',NOW())
    RETURNING *
  `, [nombres, telefono, email, mensaje, origen]);

  return rows[0];
};

export const listarConsultas = async () => {
  const { rows } = await pool.query(`
    SELECT c.id, c.nombres, c.telefono, c.estado,
           c.fecha_registro,
           u.email AS asignado_a
    FROM consultas c
    LEFT JOIN usuarios u ON u.id = c.usuario_asignado
    ORDER BY c.fecha_registro DESC
  `);
  return rows;
};

export const obtenerConsulta = async (id) => {
  const { rows } = await pool.query(
    "SELECT * FROM consultas WHERE id = $1",
    [id]
  );

  if (rows.length === 0)
    throw new Error("Consulta no encontrada");

  return rows[0];
};

export const cambiarEstado = async (id, estado, usuarioId) => {
  const estadosValidos = [
    "PENDIENTE",
    "EN_CONTACTO",
    "CONVERTIDA",
    "DESCARTADA"
  ];

  if (!estadosValidos.includes(estado))
    throw new Error("Estado inválido");

  const { rows } = await pool.query(`
    UPDATE consultas
    SET estado = $1,
        fecha_atencion = NOW(),
        usuario_asignado = COALESCE(usuario_asignado, $2)
    WHERE id = $3
    RETURNING *
  `, [estado, usuarioId, id]);

  return rows[0];
};

export const asignarConsulta = async (id, usuarioId) => {
  const { rows } = await pool.query(`
    UPDATE consultas
    SET usuario_asignado = $1
    WHERE id = $2
    RETURNING *
  `, [usuarioId, id]);

  return rows[0];
};
