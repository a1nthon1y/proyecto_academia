import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth.routes.js";
import usuariosRoutes from "./routes/usuarios.routes.js";
import personasRoutes from "./routes/personas.routes.js"
import padresRoutes from "./routes/padres.routes.js";
import tutoresRoutes from "./routes/tutores.routes.js";
import alumnosRoutes from "./routes/alumnos.routes.js";
import matriculasRoutes from "./routes/matriculas.routes.js";
import asistenciasRoutes from "./routes/asistencias.routes.js";
import pagosRoutes from "./routes/pagos.routes.js";
import consultasRoutes from "./routes/consultas.routes.js";
import ciudadesRoutes from "./routes/ciudades.routes.js";
import distritosRoutes from "./routes/distritos.routes.js";
import bancosRoutes from "./routes/bancos.routes.js";
import nivelesRoutes from "./routes/niveles.routes.js";
import cursosRoutes from "./routes/cursos.routes.js";
import contratosRoutes from "./routes/contratos.routes.js";
import logsRoutes from "./routes/logs.routes.js";

const app = express();

// Middlewares globales
app.use(cors());
app.use(express.json());

// Rutas
app.use("/api/auth", authRoutes);
app.use("/api/usuarios", usuariosRoutes);
app.use("/api/personas", personasRoutes);
app.use("/api/padres", padresRoutes);
app.use("/api/tutores", tutoresRoutes);
app.use("/api/alumnos", alumnosRoutes);
app.use("/api/matriculas", matriculasRoutes);
app.use("/api/asistencias", asistenciasRoutes);
app.use("/api/pagos", pagosRoutes);
app.use("/api/consultas", consultasRoutes);
app.use("/api/ciudades", ciudadesRoutes);
app.use("/api/distritos", distritosRoutes);
app.use("/api/bancos", bancosRoutes);
app.use("/api/niveles", nivelesRoutes);
app.use("/api/cursos", cursosRoutes);
app.use("/api/contratos", contratosRoutes);
app.use("/api/logs", logsRoutes);

// Ruta test
app.get("/", (req, res) => {
  res.json({ message: "API Academia funcionando 🚀" });
});

// Iniciar Cron Jobs
import { iniciarCronJobs } from "./services/cron.service.js";
iniciarCronJobs();

export default app;
