import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export default function validateAdminRole(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1]; // Pega o token do header

  if (!token) {
    return res
      .status(401)
      .json({ auth: false, message: "Token não fornecido." });
  }

  jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
    console.log(decoded);
    if (error) {
      return res.status(401).json({ auth: false, message: "Token inválido." });
    }

    if (decoded.role.S !== "admin") {
      return res.status(403).json({ auth: false, message: "Acesso negado." });
    }

    req.user_id = decoded.id; // Adiciona o ID do usuário à requisição
    next(); // Permite continuar para a rota
  });
}
