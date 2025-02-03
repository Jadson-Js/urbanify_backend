// Setup inicial
import express from "express";
const router = express.Router();

// Importando controllers
import { createReport } from "../controllers/reportControllers.js";

// Definindo as rotas
router.post("", createReport);

export default router;
