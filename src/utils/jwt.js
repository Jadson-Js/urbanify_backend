import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export function generateJWT(email, role) {
  return jwt.sign({ email, role }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
}
