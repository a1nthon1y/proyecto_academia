import { Router } from "express";
import {
  registrarPagoPadre,
  listarPagosPadres,
  listarMisPagos,
  generarPagoTutor,
  pagarTutor,
  listarPagosTutores
} from "../controllers/pagos.controller.js";

import { auth } from "../middlewares/auth.middleware.js";
import { allowRoles } from "../middlewares/role.middleware.js";
import { logAction } from "../middlewares/logger.middleware.js";

const router = Router();
router.use(auth);

// PADRES
// ADMIN (1) y TRABAJADOR (2)
router.post(
  "/padres",
  allowRoles(1, 2),
  logAction((req) => `Registró pago de padre para contrato/matrícula: ${req.body.matricula_id || 'N/A'}`),
  registrarPagoPadre
);

router.get(
  "/padres",
  allowRoles(1, 2),
  listarPagosPadres
);

// PADRE (3)
router.get(
  "/padres/mis-pagos",
  allowRoles(3),
  listarMisPagos
);

// TUTORES
// ADMIN (1) y TRABAJADOR (2)
router.post(
  "/tutores/generar",
  allowRoles(1, 2),
  logAction((req) => `Generó pagos para tutores (Corte mensual)`),
  generarPagoTutor
);

router.post(
  "/tutores/pagar",
  allowRoles(1, 2),
  logAction((req) => `Registró pago a tutor ID: ${req.body.tutor_id}`),
  pagarTutor
);

router.get(
  "/tutores",
  allowRoles(1, 2),
  listarPagosTutores
);

export default router;
