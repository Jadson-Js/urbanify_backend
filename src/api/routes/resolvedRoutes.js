import express from "express";

import authAdminMiddlewares from "../middlewares/authAdminMiddlewares.js";

import ResolvedController from "../controllers/ResolvedController.js";

import expressMiddleware from "../middlewares/expressMiddleware.js";

const router = express.Router();

router.get("/", authAdminMiddlewares, ResolvedController.get);

router.get(
  "/id/:id/created_at/:created_at",
  authAdminMiddlewares,
  expressMiddleware.getResolvedReport(),
  expressMiddleware.validate,
  ResolvedController.getResolved
);

export default router;
