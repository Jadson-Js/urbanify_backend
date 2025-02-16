import express from "express";
import bodyParser from "body-parser";
const app = express();
import "express-async-errors"; // Biblioteca que captura erros assincrono

app.use(bodyParser.json());

// Rotas
import usersRoutes from "./routes/userRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import logRoutes from "./routes/logRoutes.js";
import errorMiddleware from "./middlewares/errorMiddleware.js";

app.use("/user", usersRoutes);
app.use("/report", reportRoutes);
app.use("/log", logRoutes);

app.use(errorMiddleware); // Middleware que captura erros que não foram tratados

// Exporta o APPe
export default app;
