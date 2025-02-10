import express from "express";

import uploadMiddlewares from "../middlewares/uploadMiddlewares.js";

import ReportController from "../controllers/ReportController.js";

const router = express.Router();

router.post("/", uploadMiddlewares.single("file"), ReportController.create);

export default router;
