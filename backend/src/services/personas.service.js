import { pool } from "../config/db.js";
import bcrypt from "bcrypt";
import { generarUsername } from "../utils/generarUsername.js";

export const crearPersonaConUsuario = async ({
  tipo, // "PADRE" | "TUTOR"
  dni,
  nombres,
  apellidos,
  telefono,
  direccion,
  email,
  password, // 🆕 Contraseña personalizada (opcional)
  // Campos adicionales para TUTOR
  especialidad,
  nivel_id, // 🔧 Fix: usar nivel_id para coincidir con el frontend
  tarifa_por_sesion,
  ciudad_id,
  distrito_id,
  banco_id,
  cuenta_bancaria
}) => {
  if (!["PADRE", "TUTOR"].includes(tipo)) {
    throw new Error("Tipo de persona no válido");
  }

  if (!dni || !nombres || !apellidos) {
    throw new Error("DNI, nombres y apellidos son obligatorios");
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const tabla = tipo === "PADRE" ? "padres" : "tutores";
    const rolId = tipo === "PADRE" ? 3 : 4;

    // 1️⃣ Validar si ya existe la persona por DNI
    const existePersona = await client.query(
      `SELECT id FROM ${tabla} WHERE dni = $1`,
      [dni]
    );

    if (existePersona.rowCount > 0) {
      throw new Error("DNI_ALREADY_EXISTS");
    }

    // 1.1️⃣ Validar si ya existe el email en usuarios
    if (email) {
      const existeEmail = await client.query(
        "SELECT id FROM usuarios WHERE email = $1",
        [email]
      );
      if (existeEmail.rowCount > 0) {
        throw new Error("EMAIL_ALREADY_EXISTS");
      }
    }

    // 2️⃣ Generar username único
    const username = await generarUsername({
      nombres,
      apellidos,
      rol_id: rolId // 🔧 Fix: pasar rol_id en lugar de rol
    });


    // 3️⃣ Password: usar personalizada o generar temporal
    const passwordTemporal = password || Math.random()
      .toString(36)
      .slice(-8);

    console.log(`[DEBUG] Generando usuario: username=${username}, email=${email}`);

    const passwordHash = await bcrypt.hash(passwordTemporal, 10);

    // 4️⃣ Crear usuario
    const usuarioRes = await client.query(
      `
      INSERT INTO usuarios (
        username, email, password_hash, rol_id
      )
      VALUES ($1, $2, $3, $4)
      RETURNING id
      `,
      [
        username,
        email, // 🔧 No usar email || null si la DB no lo permite
        passwordHash,
        rolId
      ]
    );

    const usuarioId = usuarioRes.rows[0].id;
    console.log(`[DEBUG] Usuario creado con ID: ${usuarioId}`);

    // 5️⃣ Crear perfil PADRE / TUTOR
    let perfilRes;

    if (tipo === "PADRE") {
      console.log(`[DEBUG] Insertando PADRE perfil para usuarioId=${usuarioId}`);
      perfilRes = await client.query(
        `
        INSERT INTO padres (
          usuario_id, dni, nombres, apellidos, telefono
        )
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
        `,
        [
          usuarioId,
          dni.trim(),
          nombres.trim(),
          apellidos.trim(),
          telefono || null
        ]
      );
    } else {
      console.log(`[DEBUG] Insertando TUTOR perfil para usuarioId=${usuarioId}`);
      // TUTOR con campos adicionales
      // Nota: direccion SÍ existe en tabla tutores
      // nivel_id es FK a tabla niveles
      perfilRes = await client.query(
        `
        INSERT INTO tutores (
          usuario_id, dni, nombres, apellidos, telefono, direccion,
          especialidad, nivel_id, tarifa_por_sesion,
          ciudad_id, distrito_id, banco_id, cuenta_bancaria
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
        RETURNING *
        `,
        [
          usuarioId,
          dni.trim(),
          nombres.trim(),
          apellidos.trim(),
          telefono || null,
          direccion || null,
          especialidad || null,
          nivel_id || null, // 🔧 Usar nivel_id
          tarifa_por_sesion || null,
          ciudad_id || null,
          distrito_id || null,
          banco_id || null,
          cuenta_bancaria || null
        ]
      );
    }

    console.log(`[DEBUG] Perfil creado. Commit transacción.`);
    await client.query("COMMIT");

    return {
      perfil: perfilRes.rows[0],
      credenciales: {
        username,
        password: passwordTemporal // 🔧 Retornar la contraseña real usada
      }
    };

  } catch (error) {
    await client.query("ROLLBACK");
    console.error(`[ERROR] Fallo en crearPersonaConUsuario: ${error.message}`);

    // Capturar errores de base de datos (Unique Constraint)
    if (error.code === '23505') {
      if (error.constraint === 'usuarios_email_key' || error.detail?.includes('email')) {
        throw new Error("EMAIL_ALREADY_EXISTS");
      }
      if (error.constraint.includes('dni') || error.detail?.includes('dni')) {
        throw new Error("DNI_ALREADY_EXISTS");
      }
    }

    throw error;
  } finally {
    client.release();
  }
};

export const actualizarPersona = async ({
  tipo, // "PADRE" | "TUTOR"
  persona_id,
  nombres,
  apellidos,
  telefono,
  direccion,
  email,
  dni, // 🆕 Soportar actualización de DNI
  activo, // true | false
  // Campos adicionales para TUTOR
  especialidad,
  nivel_id,
  tarifa_por_sesion,
  ciudad_id,
  distrito_id,
  banco_id,
  cuenta_bancaria
}) => {
  if (!["PADRE", "TUTOR"].includes(tipo)) {
    throw new Error("Tipo de persona no válido");
  }

  if (!persona_id) {
    throw new Error("ID de persona requerido");
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const tabla = tipo === "PADRE" ? "padres" : "tutores";

    // 1️⃣ Verificar que exista la persona
    const personaRes = await client.query(
      `
      SELECT p.id, u.id AS usuario_id
      FROM ${tabla} p
      JOIN usuarios u ON u.id = p.usuario_id
      WHERE p.id = $1
      `,
      [persona_id]
    );

    if (personaRes.rowCount === 0) {
      throw new Error(`${tipo} no encontrado`);
    }

    const usuarioId = personaRes.rows[0].usuario_id;

    // 1.1️⃣ Validar email si está cambiando
    if (email) {
      const existeEmail = await client.query(
        "SELECT id FROM usuarios WHERE email = $1 AND id != $2",
        [email, usuarioId]
      );
      if (existeEmail.rowCount > 0) {
        throw new Error("EMAIL_ALREADY_EXISTS");
      }
    }

    // 1.2️⃣ Validar DNI si está cambiando
    if (dni) {
      const existeDni = await client.query(
        `SELECT id FROM ${tabla} WHERE dni = $1 AND id != $2`,
        [dni, persona_id]
      );
      if (existeDni.rowCount > 0) {
        throw new Error("DNI_ALREADY_EXISTS");
      }
    }

    // 2️⃣ Actualizar datos del perfil
    if (tipo === "PADRE") {
      await client.query(
        `
        UPDATE padres
        SET
          nombres   = COALESCE($1, nombres),
          apellidos = COALESCE($2, apellidos),
          telefono  = COALESCE($3, telefono),
          dni       = COALESCE($4, dni)
        WHERE id = $5
        `,
        [nombres?.trim(), apellidos?.trim(), telefono, dni?.trim(), persona_id]
      );
    } else {
      await client.query(
        `
        UPDATE tutores
        SET
          nombres           = COALESCE($1, nombres),
          apellidos         = COALESCE($2, apellidos),
          telefono          = COALESCE($3, telefono),
          direccion         = COALESCE($4, direccion),
          dni               = COALESCE($5, dni),
          especialidad      = COALESCE($6, especialidad),
          nivel_id          = COALESCE($7, nivel_id),
          tarifa_por_sesion = COALESCE($8, tarifa_por_sesion),
          ciudad_id         = COALESCE($9, ciudad_id),
          distrito_id       = COALESCE($10, distrito_id),
          banco_id          = COALESCE($11, banco_id),
          cuenta_bancaria   = COALESCE($12, cuenta_bancaria)
        WHERE id = $13
        `,
        [
          nombres?.trim(),
          apellidos?.trim(),
          telefono,
          direccion?.trim(),
          dni?.trim(),
          especialidad,
          nivel_id,
          tarifa_por_sesion,
          ciudad_id,
          distrito_id,
          banco_id,
          cuenta_bancaria,
          persona_id
        ]
      );
    }

    // 3️⃣ Actualizar usuario
    await client.query(
      `
      UPDATE usuarios
      SET
        email  = COALESCE($1, email),
        activo = COALESCE($2, activo)
      WHERE id = $3
      `,
      [
        email,
        activo,
        usuarioId
      ]
    );

    await client.query("COMMIT");
    return { message: "Persona actualizada correctamente" };

  } catch (error) {
    await client.query("ROLLBACK");

    if (error.code === '23505') {
      if (error.constraint === 'usuarios_email_key' || error.detail?.includes('email')) {
        throw new Error("EMAIL_ALREADY_EXISTS");
      }
    }

    throw error;
  } finally {
    client.release();
  }
};


