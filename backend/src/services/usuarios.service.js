import bcrypt from "bcrypt";
import { pool } from "../config/db.js";

// usuarios.service.js
export const crearUsuarioInterno = async ({
  email,
  password,
  rol_id,
  username
}) => {
  if (!email || !password || !rol_id || !username)
    throw new Error("Datos incompletos");

  // Solo ADMIN y TRABAJADOR
  if (![1, 2].includes(rol_id))
    throw new Error("Rol no permitido");

  const existe = await pool.query(
    "SELECT 1 FROM usuarios WHERE email = $1 OR username = $2",
    [email, username]
  );

  if (existe.rowCount > 0)
    throw new Error("Usuario ya registrado");

  const password_hash = await bcrypt.hash(password, 10);

  const { rows } = await pool.query(`
    INSERT INTO usuarios (email, username, password_hash, rol_id)
    VALUES ($1,$2,$3,$4)
    RETURNING id, email, username, rol_id
  `, [email, username, password_hash, rol_id]);

  return rows[0];
};

export const listarUsuarios = async () => {
  const { rows } = await pool.query(`
    SELECT u.id, u.username, u.email, u.rol_id, r.nombre AS rol, u.activo, u.creado_en
    FROM usuarios u
    JOIN roles r ON r.id = u.rol_id
    ORDER BY u.id
  `);
  return rows;
};

export const obtenerUsuario = async (id) => {
  const { rows } = await pool.query(`
    SELECT u.id, u.username, u.email, u.rol_id, r.nombre AS rol, u.activo, u.creado_en
    FROM usuarios u
    JOIN roles r ON r.id = u.rol_id
    WHERE u.id = $1
  `, [id]);

  if (rows.length === 0)
    throw new Error("Usuario no encontrado");

  return rows[0];
};

export const actualizarUsuario = async (id, { email, password, rol_id }) => {
  const usuario = await pool.query(
    "SELECT * FROM usuarios WHERE id = $1",
    [id]
  );

  if (usuario.rowCount === 0)
    throw new Error("Usuario no existe");

  let password_hash = usuario.rows[0].password_hash;

  if (password) {
    password_hash = await bcrypt.hash(password, 10);
  }

  const { rows } = await pool.query(`
    UPDATE usuarios
    SET email = COALESCE($1, email),
        username = COALESCE($2, username),
        password_hash = $3,
        rol_id = COALESCE($4, rol_id)
    WHERE id = $5
    RETURNING id, username, email, rol_id, activo
  `, [email, username, password_hash, rol_id, id]);

  return rows[0];
};

export const cambiarEstadoUsuario = async (id, activo) => {
  const { rows } = await pool.query(`
    UPDATE usuarios
    SET activo = $1
    WHERE id = $2
    RETURNING id, activo
  `, [activo, id]);

  if (rows.length === 0) {
    throw new Error("Usuario no encontrado");
  }

  return rows[0];
};
