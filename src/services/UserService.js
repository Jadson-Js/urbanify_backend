import crypto from "crypto";
import { generateJWT } from "../utils/jwt.js";
import { encrypt, decrypt } from "../utils/crypto.js";
import UserModel from "../models/UserModel.js";
import AppError from "../utils/AppError.js";

class UserService {
  async signup(email, password) {
    const passwordEncrypt = encrypt(password);

    const user = {
      id: crypto.randomUUID(),
      email: email,
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
