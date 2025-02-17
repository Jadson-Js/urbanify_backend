import express from "express";

import UserController from "../controllers/UserController.js";

// Middleware que carrega os parametros do express-validator,
import expressMiddleware from "../middlewares/expressMiddleware.js";

const router = express.Router();

router.post(
  "/signup",
  // Aqui eu chamo os parametros definidos no middleware,
  expressMiddleware.user(), // o metodo defini quais condições o email e senha devem possui para ser validos
  expressMiddleware.validate, // metodo para validar se o o metodo anterior foram validados. ou seja
  // Se o expressMidleware.userSchema detectou que a senha está vazia, ele vai lançar um erro e o "".validate" vai tratar
  UserController.signup
);

router.post(
  "/login",
  expressMiddleware.user(),
  expressMiddleware.validate,
  UserController.login
);

export default router;
