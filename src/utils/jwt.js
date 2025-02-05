import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export function generateJWT(id, role) {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "30d" });
}
