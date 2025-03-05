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

router.post(
  "/request/reset-password",
  expressMiddleware.email(),
  expressMiddleware.validate,
  UserController.requestResetPassword
);

router.post(
  "/auth/reset-password",
  expressMiddleware.user(),
  expressMiddleware.created_at(),
  expressMiddleware.code(),
  expressMiddleware.validate,
  UserController.authResetPassword
);

// rota post request-reset-password
// valida o email e se existe um usuario com esse email
// Retorna um codigo de 6 digitos

// rota reset-password
// informa o email, o codigo e a nova senha
// Verifica se o codigo é o correto, encontra o usuario pelo email, e altera a nova senha
// Retorna positivo para senha do usuario alterado

export default router;
