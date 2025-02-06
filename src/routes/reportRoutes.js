// Setup inicial
import express from "express";
const router = express.Router();

// Middlewares
import uploadMiddlewares from "../middlewares/uploadMiddlewares.js";

// Importando controllers
import { createReport } from "../controllers/reportControllers.js";

// Definindo as rotas
router.post("", uploadMiddlewares.single("file"), createReport); //vai indentificar e tratar um arquivo single nomeando: file

export default router;
