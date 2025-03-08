// IMPORTANDO DEPENDENCIAS
import express from "express";

// IMPORTANDO MIDDLEWARES
import authMiddlewares from "../middlewares/authMiddlewares.js";
import expressMiddleware from "../middlewares/expressMiddleware.js";

// IMPORTANDO CONTROLLERS
import ResolvedController from "../controllers/ResolvedController.js";

// INSTANCIANDO O ROUTER
const router = express.Router();

// INSTANCIANDO ROTAS
router.get("/", authMiddlewares("ADMIN"), ResolvedController.get);

router.get(
  "/id/:id/created_at/:created_at",
  authMiddlewares("ADMIN"),
  expressMiddleware.id(),
  expressMiddleware.created_at(),
  expressMiddleware.validate,
  ResolvedController.getResolved
);

export default router;
