// Setup inicial
import express from "express";
import bodyParser from "body-parser";
const app = express();
app.use(bodyParser.json());

// Rotas
import usersRoutes from "./routes/userRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import logRoutes from "./routes/logRoutes.js";

// Middlewares
import authMiddlewares from "./middlewares/authMiddlewares.js";
import authAdminMiddlewares from "./middlewares/authAdminMiddlewares.js";

// Integrando rotas
app.use("/user", usersRoutes);
app.use("/report", authMiddlewares, reportRoutes);
app.use("/log", authMiddlewares, authAdminMiddlewares, logRoutes);

// Exporta o APPe
export default app;
