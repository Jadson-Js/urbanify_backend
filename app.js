// Setup inicial
import express from "express";
import bodyParser from "body-parser";
const app = express();
app.use(bodyParser.json());

// Rotas
import usersRoutes from "./src/routes/userRoutes.js";
import reportRoutes from "./src/routes/reportRoutes.js";

// Middlewares
import authMiddlewares from "./src/middlewares/authMiddlewares.js";

// Integrando rotas
app.use("/users", usersRoutes);
app.use("/reports", authMiddlewares, reportRoutes);

// Exporta o APPe
export default app;
