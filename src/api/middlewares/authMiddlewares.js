// DEPENDENCIAS
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

// IMPORTANDO UTILS
import AppError from "../../utils/AppError.js";

// SETUP
dotenv.config();
export default function authMiddlewares(typeUser) {
  if (!typeUser) {
    throw new AppError(
      500,
      "Tipo do usuario não fornecido",
      "Forneça o tipo do usuario que deseja autenticar."
    );
  }

  return (req, res, next) => {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) {
        throw new AppError(
          401,
          "Token não fornecido",
          "O token de autenticação é obrigatório."
        );
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET_ACCESS);
      if (!decoded.active) {
        throw new AppError(
          403,
          "Usuário com verificação de e-mail pendente",
          "Verifique seu e-mail para ativar a conta."
        );
      }

      if (typeUser === "ADMIN" && decoded.role !== "ADMIN") {
        throw new AppError(
          403,
          "Acesso negado",
          "Você não tem permissão para acessar este recurso."
        );
      }

      req.user_email = decoded.email;
      req.role = decoded.role;
      next();
    } catch (error) {
      const status = error instanceof jwt.JsonWebTokenError ? 403 : 500;
      next(
        new AppError(status, "Falha na autenticação do Token", error.message)
      );
    }
  };
}
