import express from "express";

import UserController from "../controllers/UserController.js";

// Middleware que carrega os parametros do express-validator,
import authMiddlewares from "../middlewares/authMiddlewares.js";
import expressMiddleware from "../middlewares/expressMiddleware.js";

const router = express.Router();

router.get(
  "/verify/email-token/:token",
  expressMiddleware.emailToken(),
  expressMiddleware.validate,
  UserController.verifyEmailToken
);

router.post(
  "/signup",
  expressMiddleware.user(),
  expressMiddleware.validate,
  UserController.signup
);

router.post(
  "/login",
  expressMiddleware.user(),
  expressMiddleware.validate,
  UserController.login
);

router.post(
  "/forgot-password",
  expressMiddleware.email(),
  expressMiddleware.validate,
  UserController.sendEmailToResetPassword
);

router.get(
  "/reset-password/token/:token",
  expressMiddleware.emailToken(),
  UserController.formToResetPassword
);

router.post(
  "/reset-password",
  // expressMiddleware.user(),
  // expressMiddleware.created_at(),
  // expressMiddleware.code(),
  //expressMiddleware.validate,
  authMiddlewares,
  UserController.resetPassword
);

export default router;

// rota post request-reset-password
// valida o email e se existe um usuario com esse email
// Retorna um codigo de 6 digitos

// rota reset-password
// informa o email, o codigo e a nova senha
// Verifica se o codigo é o correto, encontra o usuario pelo email, e altera a nova senha
// Retorna positivo para senha do usuario alterado
