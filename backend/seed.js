/**
 * seed.js — Datos iniciales para proyecto_academia
 * Ejecutar: node seed.js
 */
import { pool } from "./src/config/db.js";
import bcrypt from "bcrypt";

async function seed() {
    const client = await pool.connect();
    try {
        await client.query("BEGIN");

        // ── 0. AÑADIR PRIMARY KEYS si no existen ─────────────────────
        console.log("🔧 Verificando constraints...");
        const constraintChecks = [
            { table: "roles",     pk: "roles_pkey" },
            { table: "niveles",   pk: "niveles_pkey" },
            { table: "ciudades",  pk: "ciudades_pkey" },
            { table: "distritos", pk: "distritos_pkey" },
            { table: "bancos",    pk: "bancos_pkey" },
            { table: "usuarios",  pk: "usuarios_pkey" },
        ];

        for (const { table, pk } of constraintChecks) {
            const res = await client.query(
                `SELECT 1 FROM information_schema.table_constraints
                 WHERE constraint_name = $1 AND table_name = $2`,
                [pk, table]
            );
            if (res.rows.length === 0) {
                await client.query(`ALTER TABLE "${table}" ADD PRIMARY KEY (id)`);
                console.log(`   ✅ PK añadida a ${table}`);
            }
        }

        // Unique en username de usuarios
        const uqRes = await client.query(`
            SELECT 1 FROM information_schema.table_constraints
            WHERE constraint_name = 'usuarios_username_key' AND table_name = 'usuarios'
        `);
        if (uqRes.rows.length === 0) {
            await client.query(`ALTER TABLE usuarios ADD CONSTRAINT usuarios_username_key UNIQUE (username)`);
            console.log("   ✅ UNIQUE añadido a usuarios.username");
        }

        // ── 1. ROLES ──────────────────────────────────────────────────
        console.log("🌱 Insertando roles...");
        const rolesExist = await client.query("SELECT COUNT(*) FROM roles");
        if (parseInt(rolesExist.rows[0].count) === 0) {
            await client.query(`
                INSERT INTO roles (id, nombre) VALUES
                  (1, 'ADMIN'), (2, 'TRABAJADOR'), (3, 'PADRE'), (4, 'TUTOR')
            `);
        } else {
            console.log("   ⏭ Roles ya existen, omitiendo");
        }

        // ── 2. NIVELES ────────────────────────────────────────────────
        console.log("🌱 Insertando niveles...");
        const nivelExist = await client.query("SELECT COUNT(*) FROM niveles");
        if (parseInt(nivelExist.rows[0].count) === 0) {
            await client.query(`
                INSERT INTO niveles (id, nombre) VALUES
                  (1,'Inicial'),(2,'Primaria'),(3,'Secundaria'),
                  (4,'Preuniversitario'),(5,'Universitario')
            `);
        }

        // ── 3. CIUDADES ───────────────────────────────────────────────
        console.log("🌱 Insertando ciudades...");
        const ciudadExist = await client.query("SELECT COUNT(*) FROM ciudades");
        if (parseInt(ciudadExist.rows[0].count) === 0) {
            await client.query(`
                INSERT INTO ciudades (id, nombre) VALUES
                  (1,'Lima'),(2,'Arequipa'),(3,'Trujillo'),
                  (4,'Chiclayo'),(5,'Cusco'),(6,'Piura'),
                  (7,'Huancayo'),(8,'Ica'),(9,'Tacna'),(10,'Puno')
            `);
        }

        // ── 4. DISTRITOS ──────────────────────────────────────────────
        console.log("🌱 Insertando distritos...");
        const distExist = await client.query("SELECT COUNT(*) FROM distritos");
        if (parseInt(distExist.rows[0].count) === 0) {
            await client.query(`
                INSERT INTO distritos (id, ciudad_id, nombre) VALUES
                  (1,1,'Miraflores'),(2,1,'San Isidro'),(3,1,'Surco'),
                  (4,1,'San Borja'),(5,1,'La Molina'),(6,1,'Barranco'),
                  (7,1,'Jesús María'),(8,1,'Lince'),(9,1,'Magdalena'),
                  (10,1,'Pueblo Libre'),(11,1,'San Miguel'),(12,1,'Breña'),
                  (13,1,'Rímac'),(14,1,'Cercado de Lima'),(15,1,'Los Olivos'),
                  (16,1,'San Martín de Porres'),(17,1,'Ate'),(18,1,'Santa Anita'),
                  (19,1,'El Agustino'),(20,1,'San Juan de Lurigancho'),
                  (21,2,'Cercado'),(22,2,'Cayma'),(23,2,'José Luis Bustamante'),
                  (24,3,'Trujillo'),(25,3,'Victor Larco'),(26,3,'El Porvenir'),
                  (27,4,'Chiclayo'),(28,4,'La Victoria'),
                  (29,5,'Cusco'),(30,5,'San Sebastián')
            `);
        }

        // ── 5. BANCOS ─────────────────────────────────────────────────
        console.log("🌱 Insertando bancos...");
        const bancoExist = await client.query("SELECT COUNT(*) FROM bancos");
        if (parseInt(bancoExist.rows[0].count) === 0) {
            await client.query(`
                INSERT INTO bancos (id, nombre) VALUES
                  (1,'BCP'),(2,'BBVA'),(3,'Interbank'),(4,'Scotiabank'),
                  (5,'BanBif'),(6,'Banco de la Nación'),(7,'Mibanco'),
                  (8,'Pichincha'),(9,'GNB'),(10,'Yape / BCP')
            `);
        }

        // ── 6. USUARIO ADMIN ──────────────────────────────────────────
        console.log("🌱 Creando usuario admin...");
        const userExist = await client.query(
            "SELECT 1 FROM usuarios WHERE username = $1", ["aespinoza"]
        );
        if (userExist.rows.length === 0) {
            const hash = await bcrypt.hash("123456", 10);
            await client.query(`
                INSERT INTO usuarios (username, email, password_hash, rol_id, activo)
                VALUES ($1, $2, $3, 1, true)
            `, ["aespinoza", "aespinoza@academia.com", hash]);
            console.log("   ✅ Usuario admin creado");
        } else {
            console.log("   ⏭ Usuario aespinoza ya existe");
        }

        await client.query("COMMIT");

        console.log("\n✅ Seed completado.");
        console.log("   🔑 Login: aespinoza / 123456  (rol: ADMIN)");

    } catch (err) {
        await client.query("ROLLBACK");
        console.error("❌ Error en seed:", err.message);
        process.exit(1);
    } finally {
        client.release();
        process.exit(0);
    }
}

seed();
