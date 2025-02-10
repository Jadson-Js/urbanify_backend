import express from "express";

import LogController from "../controllers/LogController.js";

const router = express.Router();

router.get("/", LogController.get); //vai indentificar e tratar um arquivo single nomeando: file
router.post("/", LogController.create); //vai indentificar e tratar um arquivo single nomeando: file

export default router;
