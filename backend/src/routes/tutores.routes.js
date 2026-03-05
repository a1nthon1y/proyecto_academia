import { Router } from "express";
import {
  listarTutores,
  obtenerTutor,
  actualizarTutor,
  obtenerMiPerfil,
  registrarDisponibilidad,
  crearTutor,
  eliminarTutor
} from "../controllers/tutores.controller.js";

import { auth } from "../middlewares/auth.middleware.js";
import { allowRoles } from "../middlewares/role.middleware.js";
import { logAction } from "../middlewares/logger.middleware.js";

const router = Router();

router.use(auth);

// ADMIN (1) y TRABAJADOR (2)
router.post("/",
  allowRoles(1, 2),
  logAction((req) => `Creó tutor DNI: ${req.body.dni}`),
  crearTutor
);

router.get("/", allowRoles(1, 2), listarTutores);

// TUTOR (4)
router.get("/perfil", allowRoles(4), obtenerMiPerfil);

// ADMIN (1) y TRABAJADOR (2)
router.get("/:id", allowRoles(1, 2), obtenerTutor);
router.put("/:id",
  allowRoles(1, 2),
  logAction((req) => `Actualizó datos del tutor ID: ${req.params.id}`),
  actualizarTutor
);

router.delete("/:id",
  allowRoles(1),
  logAction((req) => `ELIMINÓ tutor ID: ${req.params.id}`),
  eliminarTutor
);

// ADMIN (1) y TRABAJADOR (2)
router.post(
  "/:id/disponibilidad",
  allowRoles(1, 2),
  logAction((req) => `Registró disponibilidad para tutor ID: ${req.params.id}`),
  registrarDisponibilidad
);

export default router;
