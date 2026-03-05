import { Router } from "express";
import {
  registrarAsistenciaTutor,
  registrarAsistenciaAdmin,
  listarAsistencias,
  listarMisAsistencias,
  listarAsistenciasPadre
} from "../controllers/asistencias.controller.js";

import { auth } from "../middlewares/auth.middleware.js";
import { allowRoles } from "../middlewares/role.middleware.js";

const router = Router();
router.use(auth);

// TUTOR (4) registra asistencias con ubicación GPS
router.post(
  "/tutor",
  allowRoles(4),
  registrarAsistenciaTutor
);

// TUTOR (4) ve sus propias asistencias
router.get(
  "/tutor/mis-asistencias",
  allowRoles(4),
  listarMisAsistencias
);

// PADRE (3) solo puede ver asistencias (lectura)
router.get(
  "/padre",
  allowRoles(3),
  listarAsistenciasPadre
);

// ADMIN (1) registro manual/excepción
router.post(
  "/admin",
  allowRoles(1),
  registrarAsistenciaAdmin
);

// ADMIN (1) y TRABAJADOR (2) - reportes completos
router.get(
  "/",
  allowRoles(1, 2),
  listarAsistencias
);

export default router;
