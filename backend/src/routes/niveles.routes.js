import { Router } from "express";
import { getNiveles } from "../controllers/niveles.controller.js";
import { auth } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/", auth, getNiveles);

export default router;
