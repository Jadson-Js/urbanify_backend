import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export default function validateJWT(req, res, next) {
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ auth: false, message: "O token não foi fornecido" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
    if (error) {
      return res
        .status(500)
        .json({ auth: false, message: "Falha na autenticação do Token" });
    } else {
      req.user_id = decoded.id;
      next();
    }
  });
}
