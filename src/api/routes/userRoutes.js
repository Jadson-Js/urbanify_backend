// Setup inicial
import express from "express";

// Importando controllers
import UserController from "../controllers/UserController.js";

const router = express.Router();

// Definindo as rotas
router.post("/signup", UserController.signup);
router.post("/login", UserController.login);

export default router;
