import { Router } from "express";
import {
  obtenerPerfilPadre,
  listarPadres,
  listarMisHijos,
  listarMisAsistencias,
  listarMisTutores,
  crearPadre,
  actualizarPadre,
  eliminarPadre,
  reactivarPadre
} from "../controllers/padres.controller.js";

import { auth } from "../middlewares/auth.middleware.js";
import { allowRoles } from "../middlewares/role.middleware.js";
import { logAction } from "../middlewares/logger.middleware.js";

const router = Router();
router.use(auth);

// PADRE (3)
// TRABAJADOR (2) y ADMIN (1)
router.get("/", allowRoles(1, 2), listarPadres);

router.post("/",
  allowRoles(1, 2),
  logAction((req) => `Creó padre DNI: ${req.body.dni}`),
  crearPadre
);

router.put("/:id",
  allowRoles(1, 2),
  logAction((req) => `Actualizó padre ID: ${req.params.id}`),
  actualizarPadre
);

router.delete("/:id",
  allowRoles(1, 2),
  logAction((req) => `Desactivó padre ID: ${req.params.id}`),
  eliminarPadre
);

router.put("/:id/reactivar",
  allowRoles(1, 2),
  logAction((req) => `Reactivó padre ID: ${req.params.id}`),
  reactivarPadre
);

// PADRE (3)
router.get("/perfil", allowRoles(3), obtenerPerfilPadre);
router.get("/mis-hijos", allowRoles(3), listarMisHijos);
router.get("/asistencias", allowRoles(3), listarMisAsistencias);
router.get("/mis-tutores", allowRoles(3), listarMisTutores);
export default router;
