// Setup inicial
import express from "express";
const router = express.Router();

// Importando controllers
import {
  getHistorical,
  postHistory,
} from "../controllers/historyControllers.js";

// Definindo as rotas
router.get("", getHistorical); //vai indentificar e tratar um arquivo single nomeando: file
router.post("", postHistory); //vai indentificar e tratar um arquivo single nomeando: file

export default router;
