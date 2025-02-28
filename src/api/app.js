import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
const app = express();
import "express-async-errors"; // Biblioteca que captura erros assincrono

app.use(cors());
app.use(bodyParser.json());

// Rotas
import usersRoutes from "./routes/userRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import resolvedReportRoutes from "./routes/resolvedReportRoutes.js";

import errorMiddleware from "./middlewares/errorMiddleware.js";

app.use("/user", usersRoutes);
app.use("/report", reportRoutes);
app.use("/report/resolved/", resolvedReportRoutes);

app.use(errorMiddleware); // Middleware que captura erros que não foram tratados

// Exporta o APPe
export default app;
