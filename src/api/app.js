// IMPORTANDO DEPENDENCIAS/BIBLIOTECAS
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import "express-async-errors"; // Biblioteca que captura erros assincrono

// IMPORTANDO ROTAS
import usersRoutes from "./routes/userRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import resolvedRoutes from "./routes/resolvedRoutes.js";

// IMPORTANDO MIDDLEWARES
import errorMiddleware from "./middlewares/errorMiddleware.js";

// SETUP
const app = express();
app.use(cors());
app.use(bodyParser.json());

// INSTANCIANDO AS ROTAS
app.use("/user", usersRoutes);
app.use("/report", reportRoutes);
app.use("/resolved", resolvedRoutes);

// MIDDLEWARE DE ERRO
app.use(errorMiddleware);

export default app;
