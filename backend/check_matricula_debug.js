import { pool } from "./src/config/db.js";

const checkMatricula = async (id) => {
    console.log(`🔍 Verificando matrícula ID: ${id}...`);

    try {
        // 1. Verificar existencia simple
        const simple = await pool.query("SELECT * FROM matriculas WHERE id = $1", [id]);
        if (simple.rowCount === 0) {
            console.log("❌ La matrícula NO existe en la tabla 'matriculas'.");
            console.log("   IDs existentes:", (await pool.query("SELECT id FROM matriculas LIMIT 10")).rows.map(r => r.id));
            process.exit(1);
        } else {
            console.log("✅ Matrícula encontrada en tabla simple:", simple.rows[0]);
        }

        // 2. Ejecutar la query compleja (la que usa el servicio)
        const queryCompleja = `
    SELECT 
      m.*,
      al.nombres || ' ' || al.apellidos AS alumno_nombre,
      al.dni AS alumno_dni,
      al.telefono AS alumno_telefono,
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
    `;

        const compleja = await pool.query(queryCompleja, [id]);

        if (compleja.rowCount > 0) {
            console.log("✅ Query Compleja (LEFT JOIN) exitosa:");
            console.log(compleja.rows[0]);
        } else {
            console.log("❌ Query Compleja falló (no devolvió filas) a pesar de que el registro simple existe.");
        }

    } catch (error) {
        console.error("❌ Error ejecutando script:", error);
    } finally {
        await pool.end();
    }
};

checkMatricula(1);
