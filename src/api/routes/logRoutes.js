// Setup inicial
import express from "express";

// Importando controllers
import LogController from "../controllers/LogController.js";

const router = express.Router();

// Definindo as rotas
router.get("/", LogController.get); //vai indentificar e tratar um arquivo single nomeando: file
router.post("/", LogController.create); //vai indentificar e tratar um arquivo single nomeando: file

export default router;
