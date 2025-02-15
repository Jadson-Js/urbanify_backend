import express from "express";
import { body, validationResult } from "express-validator";
import errorMiddleware from "../middlewares/errorMiddleware.js";

import UserController from "../controllers/UserController.js";

const router = express.Router();

router.post("/signup", UserController.signup, errorMiddleware);
router.post("/login", UserController.login);

export default router;
