// IMPORTANDO DEPENDENCIAS
import express from "express";

// IMPORTANDO MIDDLEWARES
import authAdminMiddlewares from "../middlewares/authAdminMiddlewares.js";
import expressMiddleware from "../middlewares/expressMiddleware.js";

// IMPORTANDO CONTROLLERS
import ResolvedController from "../controllers/ResolvedController.js";

// INSTANCIANDO O ROUTER
const router = express.Router();

// INSTANCIANDO ROTAS
router.get("/", authAdminMiddlewares, ResolvedController.get);

router.get(
  "/id/:id/created_at/:created_at",
  authAdminMiddlewares,
  expressMiddleware.id(),
  expressMiddleware.created_at(),
  expressMiddleware.validate,
  ResolvedController.getResolved
);

export default router;
