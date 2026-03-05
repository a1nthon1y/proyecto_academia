
import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'academ_db',
    password: '123456',
    port: 5432,
});

async function debugTutor1() {
    try {
        console.log("--- DEBUG ESPECÍFICO TUTOR 1 ---");

        // 1. Buscar el usuario "tutor1"
        const userRes = await pool.query("SELECT id, username, email FROM usuarios WHERE username = 'tutor1'");
        if (userRes.rowCount === 0) {
            console.log("Usuario 'tutor1' no encontrado.");
        } else {
            const user = userRes.rows[0];
            console.log(`Usuario 'tutor1' encontrado: ID=${user.id}, Email=${user.email}`);

            // Ver si tiene perfil de tutor
            const tutorRes = await pool.query("SELECT id, nombres, apellidos FROM tutores WHERE usuario_id = $1", [user.id]);
            if (tutorRes.rowCount === 0) {
                console.log("El usuario 'tutor1' no tiene un perfil en la tabla 'tutores'.");
            } else {
                const tutor = tutorRes.rows[0];
                console.log(`Perfil de Tutor encontrado: ID=${tutor.id}, Nombre=${tutor.nombres} ${tutor.apellidos}`);

                // Ver matrículas
                const matRes = await pool.query("SELECT id, estado, alumno_id FROM matriculas WHERE tutor_id = $1", [tutor.id]);
                console.log(`Matrículas para este tutor (${matRes.rowCount}):`);
                console.table(matRes.rows);
            }
        }

        // 2. Ver si hay un tutor con ID 1 (como dice el usuario)
        const tutor1Res = await pool.query("SELECT t.id, t.usuario_id, u.username, u.email FROM tutores t JOIN usuarios u ON u.id = t.usuario_id WHERE t.id = 1");
        if (tutor1Res.rowCount > 0) {
            const t1 = tutor1Res.rows[0];
            console.log(`\nTutor con ID 1 (tabla tutores):`);
            console.log(`ID=${t1.id}, UsuarioID=${t1.usuario_id}, Username=${t1.username}`);
        }

        await pool.end();
    } catch (error) {
        console.error("Error en debug:", error);
    }
}

debugTutor1();
