// Setup inicial
import express from "express";
const router = express.Router();

// Importando controllers
import { signup, login } from "../controllers/userControllers.js";

// Definindo as rotas
router.post("/signup", signup);
router.post("/login", login);

export default router;
