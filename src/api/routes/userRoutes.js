// Setup inicial
import express from "express";
const router = express.Router();

// Importando controllers
import UserController from "../controllers/UserController.js";

// Definindo as rotas
router.post("/signup", UserController.signup);
router.post("/login", UserController.login);

export default router;
