import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import AppError from "../utils/AppError.js";
dotenv.config();

export function generateJWT(user) {
  const { email, role, active } = user;

  const access = jwt.sign(
    { email, role, active },
    process.env.JWT_SECRET_ACCESS,
    {
      expiresIn: "30m",
    }
  );
  const refresh = jwt.sign(
    { email, role, active },
    process.env.JWT_SECRET_REFRESH,
    {
      expiresIn: "30d",
    }
  );

  return { access, refresh };
}

export async function generateAccessToken(refreshToken) {
  const accessToken = jwt.verify(
    refreshToken,
    process.env.JWT_SECRET_REFRESH,
    (err, decoded) => {
      if (err) {
        throw new AppError(
          403,
          "Refresh token invalido",
          "Refresh token invalido"
        );
      }

      const { email, role, active } = decoded;

      const access = jwt.sign(
        { email, role, active },
        process.env.JWT_SECRET_ACCESS,
        {
          expiresIn: "30m",
        }
      );

      return access;
    }
  );

  return accessToken;
}
