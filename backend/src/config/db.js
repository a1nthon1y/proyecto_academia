import pkg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pkg;

// Soporta DATABASE_URL (Neon/cloud) o variables individuales DB_*
const poolConfig = process.env.DATABASE_URL
  ? {
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
    }
  : {
      host:     process.env.DB_HOST,
      port:     process.env.DB_PORT,
      user:     process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      ssl: process.env.DB_SSL === "true" ? { rejectUnauthorized: false } : false,
    };

const pool = new Pool(poolConfig);

pool.on("connect", () => {
  console.log("🟢 Conectado a PostgreSQL");
});

pool.query("SELECT 1")
  .then(() => console.log("✅ PostgreSQL OK"))
  .catch(err => console.error("❌ PostgreSQL ERROR:", err.message));

export { pool };
