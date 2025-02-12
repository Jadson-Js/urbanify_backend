import express from "express";

import LogController from "../controllers/LogController.js";

import authAdminMiddlewares from "../middlewares/authAdminMiddlewares.js";

const router = express.Router();

router.get("/", authAdminMiddlewares, LogController.get); //vai indentificar e tratar um arquivo single nomeando: file
router.post("/", authAdminMiddlewares, LogController.create); //vai indentificar e tratar um arquivo single nomeando: file

export default router;
