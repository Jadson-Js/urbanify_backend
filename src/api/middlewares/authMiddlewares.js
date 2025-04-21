// DEPENDENCIAS
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

// IMPORTANDO UTILS
import AppError from "../../utils/AppError.js";

// SETUP
dotenv.config();
export default function authMiddlewares(allowedRoles = []) {
  return (req, res, next) => {
    try {
      if (!Array.isArray(allowedRoles) || allowedRoles.length === 0) {
        throw new AppError(
          400,
          "User roles not provided",
          "Please provide at least one user role to authenticate.",
        );
      }

      const token = req.headers.authorization?.split(" ")[1];
      if (!token) {
        throw new AppError(
          401, // Código de status apropriado para falta de autenticação
          "Token not provided",
          "The authentication token is mandatory and must be included.",
        );
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET_ACCESS);
      if (!decoded.active) {
        throw new AppError(
          403, // Código de status para acesso proibido devido à condição do usuário
          "User with pending email verification",
          "Please verify your email to activate your account.",
        );
      }

      if (!allowedRoles.includes(decoded.role)) {
        throw new AppError(
          403,
          "Access denied",
          "You do not have permission to access this resource.",
        );
      }

      req.user_email = decoded.email;
      req.role = decoded.role;
      next();
    } catch (error) {
      const status = error instanceof jwt.JsonWebTokenError ? 403 : 500;
      next(
        new AppError(status, "Falha na autenticação do Token", error.message),
      );
    }
  };
}
