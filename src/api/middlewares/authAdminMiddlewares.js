import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export default function validateAdminRole(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ auth: false, message: "Token não fornecido." });
  }

  jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
    if (error) {
      return res.status(401).json({ auth: false, message: "Token inválido." });
    }

    if (decoded.role.S !== "ADMIN") {
      return res.status(403).json({ auth: false, message: "Acesso negado." });
    }

    req.user_id = decoded.id;
    req.role = decoded.role.S;
    next();
  });
}
