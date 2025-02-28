import express from "express";

import authMiddlewares from "../middlewares/authMiddlewares.js";
import authAdminMiddlewares from "../middlewares/authAdminMiddlewares.js";

import ResolvedReportController from "../controllers/ResolvedReportController.js";

import expressMiddleware from "../middlewares/expressMiddleware.js";

const router = express.Router();

router.get("/", authAdminMiddlewares, ResolvedReportController.get);

// router.get("/my", authMiddlewares, ResolvedReportController.getMyReports);

// router.get(
//   "/address/:address/geohash/:geohash",
//   authAdminMiddlewares,
//   expressMiddleware.getReport(),
//   expressMiddleware.validate,
//   ResolvedReportController.getReport
// );

router.get(
  "/status/id/:id/created_at/:created_at",
  authMiddlewares,
  expressMiddleware.getStatusResolvedReport(),
  expressMiddleware.validate,
  ResolvedReportController.getStatus
);

export default router;
