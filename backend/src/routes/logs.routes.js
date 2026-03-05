import { Router } from "express";
import { listarLogs, obtenerEstadisticas } from "../controllers/logs.controller.js";
import { auth } from "../middlewares/auth.middleware.js";
import { allowRoles } from "../middlewares/role.middleware.js";

const router = Router();
router.use(auth);

// Solo ADMIN puede ver logs
router.get("/", allowRoles(1), listarLogs);
router.get("/estadisticas", allowRoles(1), obtenerEstadisticas);

export default router;
