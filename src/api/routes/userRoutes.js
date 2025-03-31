// IMPORTANDO DEPENCIAS
import express from "express";

// IMPORTANDO CONTROLLERS
import UserController from "../controllers/UserController.js";

// IMPORTANDO MIDDLEWARES
import authMiddlewares from "../middlewares/authMiddlewares.js";
import expressMiddleware from "../middlewares/expressMiddleware.js";

// INSTANCIANDO O ROUTER
const router = express.Router();

// INSTANCIANDO ROTAS
router.get("/", authMiddlewares("ADMIN"), UserController.get);

router.post(
  "/signup",
  expressMiddleware.email(),
  expressMiddleware.password(),
  expressMiddleware.validate,
  UserController.signup
);

router.get(
  "/verify/email/token/:accessToken",
  expressMiddleware.accessToken(),
  expressMiddleware.validate,
  UserController.verifyEmailToken
);

router.post(
  "/login",
  expressMiddleware.email(),
  expressMiddleware.password(),
  expressMiddleware.validate,
  UserController.login
);

router.post(
  "/access",
  expressMiddleware.refreshToken(),
  expressMiddleware.validate,
  UserController.generateAccessToken
);

router.post(
  "/forgot-password",
  expressMiddleware.email(),
  expressMiddleware.validate,
  UserController.sendEmailToResetPassword
);

router.get(
  "/reset-password/token/:accessToken",
  expressMiddleware.accessToken(),
  expressMiddleware.validate,
  UserController.formToResetPassword
);

router.post(
  "/reset-password",
  expressMiddleware.newPassword(),
  expressMiddleware.validate,
  UserController.resetPassword
);

export default router;
