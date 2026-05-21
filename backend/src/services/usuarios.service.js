import bcrypt from "bcrypt";
import { pool } from "../config/db.js";
import { generarUsername } from "../utils/generarUsername.js";

/**
 * Crear usuario ADMIN o TRABAJADOR.
 * - Si llega username explícito, se usa.
 * - Si llegan nombres y apellidos pero no username, se genera automáticamente
 *   con el mismo patrón que padres/tutores (a/w + inicial + apellido).
 */
export const crearUsuarioInterno = async ({
  email,
  password,
  rol_id,
  username,
  nombres,
  apellidos,
}) => {
  if (!email || !password || !rol_id)
    throw new Error("Email, contraseña y rol son obligatorios");

  // Solo ADMIN y TRABAJADOR
  if (![1, 2].includes(rol_id))
    throw new Error("Rol no permitido (sólo ADMIN o TRABAJADOR)");

  // username: usar el provisto o autogenerar a partir de nombres/apellidos
  let finalUsername = username?.trim();
  if (!finalUsername) {
    if (!nombres || !apellidos) {
      throw new Error("Debe enviar 'username' o ('nombres' y 'apellidos') para generarlo");
    }
    finalUsername = await generarUsername({ nombres, apellidos, rol_id });
  }

  const existe = await pool.query(
    "SELECT 1 FROM usuarios WHERE email = $1 OR username = $2",
    [email, finalUsername]
  );

  if (existe.rowCount > 0)
    throw new Error("Email o nombre de usuario ya registrado");

  const password_hash = await bcrypt.hash(password, 10);

  const { rows } = await pool.query(`
    INSERT INTO usuarios (email, username, password_hash, rol_id, nombres, apellidos)
    VALUES ($1,$2,$3,$4,$5,$6)
    RETURNING id, email, username, rol_id, nombres, apellidos, activo, creado_en
  `, [email, finalUsername, password_hash, rol_id, nombres || null, apellidos || null]);

  return rows[0];
};

export const listarUsuarios = async () => {
  const { rows } = await pool.query(`
    SELECT u.id, u.username, u.email, u.rol_id, r.nombre AS rol,
           u.nombres, u.apellidos, u.activo, u.creado_en
    FROM usuarios u
    JOIN roles r ON r.id = u.rol_id
    ORDER BY u.id
  `);
  return rows;
};

export const obtenerUsuario = async (id) => {
  const { rows } = await pool.query(`
    SELECT u.id, u.username, u.email, u.rol_id, r.nombre AS rol,
           u.nombres, u.apellidos, u.activo, u.creado_en
    FROM usuarios u
    JOIN roles r ON r.id = u.rol_id
    WHERE u.id = $1
  `, [id]);

  if (rows.length === 0)
    throw new Error("Usuario no encontrado");

  return rows[0];
};

export const actualizarUsuario = async (id, { email, password, rol_id, username, nombres, apellidos }) => {
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
    SET email         = COALESCE($1, email),
        username      = COALESCE($2, username),
        password_hash = $3,
        rol_id        = COALESCE($4, rol_id),
        nombres       = COALESCE($5, nombres),
        apellidos     = COALESCE($6, apellidos)
    WHERE id = $7
    RETURNING id, username, email, rol_id, nombres, apellidos, activo
  `, [email, username, password_hash, rol_id, nombres, apellidos, id]);

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
