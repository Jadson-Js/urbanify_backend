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
router.get("/", authMiddlewares(["ADMIN"]), UserController.get);

router.post(
  "/signup",
  expressMiddleware.email(),
  expressMiddleware.password(),
  expressMiddleware.validate,
  UserController.signup,
);

router.post(
  "/login",
  expressMiddleware.email(),
  expressMiddleware.password(),
  expressMiddleware.validate,
  UserController.login,
);

router.post(
  "/auth/google",
  expressMiddleware.authToken(),
  expressMiddleware.validate,
  UserController.authGoogle,
);

router.post(
  "/access",
  expressMiddleware.refreshToken(),
  expressMiddleware.validate,
  UserController.generateAccessToken,
);

export default router;
