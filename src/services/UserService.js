import { generateJWT } from "../utils/jwt.js";
import crypto from "crypto";
import { encrypt, decrypt } from "../utils/crypto.js";
import UserModel from "../models/UserModel.js";
import AppError from "../utils/AppError.js";

class UserService {
  async signup(data) {
    const passwordEncrypt = encrypt(data.password);

    const user = {
      id: crypto.randomUUID(),
      email: data.email,
      password: passwordEncrypt,
      role: "USER",
      active: true,
      reports_id: [],
      created_at: new Date().toISOString(),
    };

    return await UserModel.signup(user);
  }

  async login(email, password) {
    const user = await UserModel.getByEmail(email);

    if (!user) {
      throw new AppError(
        404,
        "Usuario não encontrado",
        "Email incorreto ou inexistente"
      );
    } else {
      const passwordDecrypt = decrypt(user.password);

      if (password === passwordDecrypt) {
        user.token = generateJWT(user.email, user.role);
        return user;
      }
    }
  }
}

export default new UserService();
