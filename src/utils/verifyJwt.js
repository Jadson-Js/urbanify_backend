import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import AppError from "../utils/AppError.js";
dotenv.config();

export default async function verifyJwt(token) {
  const valid = jwt.verify(
    token,
    process.env.JWT_SECRET_ACCESS,
    (err, decoded) => {
      if (err) {
        throw new AppError(401, "TOken invalido", "Token invalido");
      }
      return decoded;
    }
  );

  return valid;
}
