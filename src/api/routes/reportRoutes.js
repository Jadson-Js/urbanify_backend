import express from "express";

import authMiddlewares from "../middlewares/authMiddlewares.js";
import authAdminMiddlewares from "../middlewares/authAdminMiddlewares.js";
import uploadMiddlewares from "../middlewares/uploadMiddlewares.js";

import ReportController from "../controllers/ReportController.js";

const router = express.Router();

// router.get("/", authAdminMiddlewares, ReportController.get);

router.get("/", authAdminMiddlewares, ReportController.get);

router.post(
  "/",
  authMiddlewares,
  uploadMiddlewares.single("file"),
  ReportController.create
);

router.delete("/", authMiddlewares, ReportController.delete);

export default router;
