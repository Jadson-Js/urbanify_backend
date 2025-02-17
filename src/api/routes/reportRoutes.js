import express from "express";

import authMiddlewares from "../middlewares/authMiddlewares.js";
import authAdminMiddlewares from "../middlewares/authAdminMiddlewares.js";
import uploadMiddlewares from "../middlewares/uploadMiddlewares.js";

import ReportController from "../controllers/ReportController.js";

import expressMiddleware from "../middlewares/expressMiddleware.js";

const router = express.Router();

router.get("/", authAdminMiddlewares, ReportController.get);
router.get("/my", authMiddlewares, ReportController.getMyReports);
router.get(
  "/status",
  authMiddlewares,
  expressMiddleware.getStatus(),
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

router.delete(
  "/",
  authMiddlewares,
  expressMiddleware.getStatus(),
  expressMiddleware.validate,
  ReportController.delete
);

export default router;
