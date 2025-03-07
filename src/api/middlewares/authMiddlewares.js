// DEPENDENCIAS
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

// IMPORTANDO UTILS
import AppError from "../../utils/AppError.js";

// SETUP
dotenv.config();

export default function validateJWT(req, res, next) {
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ auth: false, message: "O token não foi fornecido" });
  }

  jwt.verify(token, process.env.JWT_SECRET_ACCESS, (error, decoded) => {
    if (error) {
      return res
        .status(500)
        .json({ auth: false, message: "Falha na autenticação do Token" });
    } else {
      if (!decoded.active) {
        throw new AppError(
          403,
          "Usuario com verificação de email pendente",
          "Usuario com verificação de email pendente"
        );
      }

      req.user_email = decoded.email;
      req.role = decoded.role;
      next();
    }
  });
}
