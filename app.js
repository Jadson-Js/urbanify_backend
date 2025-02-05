// Setup inicial
import express from "express";
import bodyParser from "body-parser";
const app = express();
app.use(bodyParser.json());

// Rotas
import usersRoutes from "./src/routes/userRoutes.js";
import reportRoutes from "./src/routes/reportRoutes.js";
import historyRoutes from "./src/routes/historyRoutes.js";

// Middlewares
import authMiddlewares from "./src/middlewares/authMiddlewares.js";
import authAdminMiddlewares from "./src/middlewares/authAdminMiddlewares.js";

// Integrando rotas
app.use("/user", usersRoutes);
app.use("/report", authMiddlewares, reportRoutes);
app.use("/history", authMiddlewares, authAdminMiddlewares, historyRoutes);

// Exporta o APPe
export default app;
