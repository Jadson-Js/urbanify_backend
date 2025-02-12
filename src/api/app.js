// Setup inicial
import express from "express";
import bodyParser from "body-parser";
const app = express();
app.use(bodyParser.json());

// Rotas
import usersRoutes from "./routes/userRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import logRoutes from "./routes/logRoutes.js";

// Integrando rotas
app.use("/user", usersRoutes);
app.use("/report", reportRoutes);
app.use("/log", logRoutes);

// Exporta o APPe
export default app;
