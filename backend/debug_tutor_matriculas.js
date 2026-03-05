
import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'academ_db',
    password: '123456',
    port: 5432,
});

async function checkTutorMatriculas() {
    try {
        console.log("--- DEBUG TUTOR MATRICULAS ---");

        // 1. Encontrar un tutor (cualquiera para probar)
        const tutorsRes = await pool.query("SELECT t.id, t.nombres, t.apellidos, u.username FROM tutores t JOIN usuarios u ON u.id = t.usuario_id LIMIT 1");
        if (tutorsRes.rowCount === 0) {
            console.log("No hay tutores en la base de datos.");
            return;
        }
        const tutor = tutorsRes.rows[0];
        console.log(`Probando con Tutor: ${tutor.nombres} ${tutor.apellidos} (${tutor.username}, ID: ${tutor.id})`);

        // 2. Buscar matrículas para este tutor
        const matriculasRes = await pool.query(`
            SELECT 
                id, 
                estado, 
                fecha_inicio::date, 
                fecha_fin::date,
                (fecha_inicio <= CURRENT_DATE AND (fecha_fin IS NULL OR fecha_fin >= CURRENT_DATE)) as es_hoy
            FROM matriculas 
            WHERE tutor_id = $1
        `, [tutor.id]);

        console.log(`Matrículas encontradas (${matriculasRes.rowCount}):`);
        console.table(matriculasRes.rows);

        // 3. Ejecutar la query exacta que usa el servicio
        const serviceQueryRes = await pool.query(`
            SELECT 
                m.id, 
                m.estado,
                m.direccion_clases,
                m.alumno_id,
                al.nombres || ' ' || al.apellidos AS alumno,
                al.dni AS alumno_dni,
                m.curso_id,
                c.nombre AS curso
            FROM matriculas m
            JOIN alumnos al ON al.id = m.alumno_id
            JOIN cursos c ON c.id = m.curso_id
            WHERE m.tutor_id = $1 AND m.estado = 'ACTIVO'
            ORDER BY m.id DESC
        `, [tutor.id]);

        console.log(`Matrículas devueltas por el servicio (estado = 'ACTIVO'):`);
        console.table(serviceQueryRes.rows);

        await pool.end();
    } catch (error) {
        console.error("Error en debug:", error);
    }
}

checkTutorMatriculas();
