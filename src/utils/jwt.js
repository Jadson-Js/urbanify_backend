import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export function generateJWT(email, role) {
  const access = jwt.sign({ email, role }, process.env.JWT_SECRET_ACCESS, {
    expiresIn: "30m",
  });
  const refresh = jwt.sign({ email, role }, process.env.JWT_SECRET_REFRESH, {
    expiresIn: "30d",
  });

  return { access, refresh };
}

export async function generateAccessToken(refreshToken) {
  const accessToken = jwt.verify(
    refreshToken,
    process.env.JWT_SECRET_REFRESH,
    (err, decoded) => {
      if (err)
        return res.status(403).json({ message: "Refresh Token inválido" });

      const { email, role } = decoded;

      const access = jwt.sign({ email, role }, process.env.JWT_SECRET_ACCESS, {
        expiresIn: "30m",
      });

      return access;
    }
  );

  return accessToken;
}
