// IMPORTANDO DEPENDENCIAS
import express from "express";

// IMPORTANDO MIDDLEWARES
import authMiddlewares from "../middlewares/authMiddlewares.js";
import uploadMiddlewares from "../middlewares/uploadMiddlewares.js";
import expressMiddleware from "../middlewares/expressMiddleware.js";

// IMPORTANDO CONTROLLERS
import ReportController from "../controllers/ReportController.js";

// INSTANCIANDO O ROUTER
const router = express.Router();

// INSTANCIANDO ROTAS
router.get("/", authMiddlewares("ADMIN"), ReportController.get);

router.get("/my", authMiddlewares("USER"), ReportController.getMyReports);

router.get(
  "/address/:address/geohash/:geohash",
  authMiddlewares("ADMIN"),
  expressMiddleware.address(),
  expressMiddleware.geohash(),
  expressMiddleware.validate,
  ReportController.getReport
);

router.get(
  "/status/address/:address/geohash/:geohash",
  authMiddlewares("USER"),
  expressMiddleware.address(),
  expressMiddleware.geohash(),
  expressMiddleware.validate,
  ReportController.getStatus
);

router.post(
  "/",
  authMiddlewares("USER"),
  uploadMiddlewares.single("file"),
  expressMiddleware.postReport,
  ReportController.create
);

router.patch(
  "/address/:address/geohash/:geohash",
  authMiddlewares("ADMIN"),
  expressMiddleware.address(),
  expressMiddleware.geohash(),
  expressMiddleware.status(),
  expressMiddleware.validate,
  ReportController.updateStatus
);

router.delete(
  "/address/:address/geohash/:geohash",
  authMiddlewares("USER"),
  expressMiddleware.address(),
  expressMiddleware.geohash(),
  ReportController.delete
);

export default router;
