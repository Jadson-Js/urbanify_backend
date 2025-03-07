// IMPORTANDO DEPENDENCIAS
import express from "express";

// IMPORTANDO MIDDLEWARES
import authMiddlewares from "../middlewares/authMiddlewares.js";
import authAdminMiddlewares from "../middlewares/authAdminMiddlewares.js";
import uploadMiddlewares from "../middlewares/uploadMiddlewares.js";
import expressMiddleware from "../middlewares/expressMiddleware.js";

// IMPORTANDO CONTROLLERS
import ReportController from "../controllers/ReportController.js";

// INSTANCIANDO O ROUTER
const router = express.Router();

// INSTANCIANDO ROTAS
router.get("/", authAdminMiddlewares, ReportController.get);

router.get("/my", authMiddlewares, ReportController.getMyReports);

router.get(
  "/address/:address/geohash/:geohash",
  authAdminMiddlewares,
  expressMiddleware.address(),
  expressMiddleware.geohash(),
  expressMiddleware.validate,
  ReportController.getReport
);

router.get(
  "/status/address/:address/geohash/:geohash",
  authMiddlewares,
  expressMiddleware.address(),
  expressMiddleware.geohash(),
  expressMiddleware.validate,
  ReportController.getStatus
);

router.post(
  "/",
  authMiddlewares,
  uploadMiddlewares.single("file"),
  expressMiddleware.postReport,
  ReportController.create
);

router.patch(
  "/address/:address/geohash/:geohash",
  authAdminMiddlewares,
  expressMiddleware.address(),
  expressMiddleware.geohash(),
  expressMiddleware.status(),
  expressMiddleware.validate,
  ReportController.updateStatus
);

router.delete(
  "/",
  authMiddlewares,
  expressMiddleware.address(),
  expressMiddleware.geohash(),
  ReportController.delete
);

export default router;
