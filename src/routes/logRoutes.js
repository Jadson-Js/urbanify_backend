// Setup inicial
import express from "express";
const router = express.Router();

// Importando controllers
import { getLogs, postLog } from "../controllers/logControllers.js";

// Definindo as rotas
router.get("", getLogs); //vai indentificar e tratar um arquivo single nomeando: file
router.post("", postLog); //vai indentificar e tratar um arquivo single nomeando: file

export default router;
