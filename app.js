// Setup inicial
import express from "express";
import bodyParser from "body-parser";
const app = express();
app.use(bodyParser.json());

// Rotas
import usersRoute from "./src/routes/userRoute.js";

// Integrando rotas
app.use("/users", usersRoute);

export default app;
