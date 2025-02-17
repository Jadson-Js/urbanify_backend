import express from "express";

import LogController from "../controllers/LogController.js";

import authAdminMiddlewares from "../middlewares/authAdminMiddlewares.js";
import expressMiddleware from "../middlewares/expressMiddleware.js";

const router = express.Router();

router.get("/", LogController.get); //vai indentificar e tratar um arquivo single nomeando: file

router.post(
  "/",
  authAdminMiddlewares,
  expressMiddleware.postLog(),
  expressMiddleware.validate,
  LogController.create
); //vai indentificar e tratar um arquivo single nomeando: file

export default router;
