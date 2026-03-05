
import { Router } from "express";
import { listarCiudades } from "../controllers/ciudades.controller.js";
import { auth } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/", auth, listarCiudades);

export default router;
