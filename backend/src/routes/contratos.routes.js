import { Router } from "express";
import {
    crearContrato,
    listarContratos,
    obtenerContrato,
    actualizarContrato
} from "../controllers/contratos.controller.js";

import { auth } from "../middlewares/auth.middleware.js";
import { allowRoles } from "../middlewares/role.middleware.js";
import { logAction } from "../middlewares/logger.middleware.js";

const router = Router();
router.use(auth);

// ADMIN (1) y TRABAJADOR (2): gestión completa de contratos
router.use(allowRoles(1, 2));

router.post("/",
    logAction((req) => `Creó contrato para tutor ID: ${req.body.tutor_id}`),
    crearContrato
);
router.get("/", listarContratos);
router.get("/:id", obtenerContrato);
router.put("/:id",
    logAction((req) => `Actualizó documento contrato ID: ${req.params.id}`),
    actualizarContrato
);

export default router;
