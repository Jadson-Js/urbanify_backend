// Setup inicial
import express from "express";

// Middlewares
import uploadMiddlewares from "../middlewares/uploadMiddlewares.js";

// Importando controllers
import ReportController from "../controllers/ReportController.js";

const router = express.Router();

// Definindo as rotas
router.post("/", uploadMiddlewares.single("file"), ReportController.create); //vai indentificar e tratar um arquivo single nomeando: file

export default router;
