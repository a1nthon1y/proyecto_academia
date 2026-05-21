import { pool } from "./src/config/db.js";

async function migrate() {
  console.log("⏳ Agregando columnas nombres y apellidos a la tabla usuarios...");
  try {
    await pool.query(`
      ALTER TABLE usuarios
      ADD COLUMN IF NOT EXISTS nombres VARCHAR(120),
      ADD COLUMN IF NOT EXISTS apellidos VARCHAR(120)
    `);

    // Backfill: copiar nombres/apellidos desde padres y tutores
    // para usuarios que ya tienen perfil
    await pool.query(`
      UPDATE usuarios u
      SET nombres = p.nombres,
          apellidos = p.apellidos
      FROM padres p
      WHERE p.usuario_id = u.id
        AND (u.nombres IS NULL OR u.apellidos IS NULL)
    `);

    await pool.query(`
      UPDATE usuarios u
      SET nombres = t.nombres,
          apellidos = t.apellidos
      FROM tutores t
      WHERE t.usuario_id = u.id
        AND (u.nombres IS NULL OR u.apellidos IS NULL)
    `);

    const { rows } = await pool.query(`
      SELECT id, username, email, rol_id, nombres, apellidos
      FROM usuarios
      ORDER BY id
    `);

    console.log("✅ Migración completada. Estado actual:");
    console.table(rows);
  } catch (e) {
    console.error("❌ Error:", e.message);
  } finally {
    await pool.end();
  }
}

migrate();
