// Setup inicial
import { generateJWT } from "../utils/jwt.js";
import crypto from "crypto";
import { encrypt, decrypt } from "../utils/crypto.js";
import UserModel from "../models/UserModel.js";

class UserService {
  async signup(data) {
    const passwordEncrypt = encrypt(data.password);

    const user = {
      id: crypto.randomBytes(32).toString("hex"),
      email: data.email,
      password: passwordEncrypt,
      role: "USER",
      active: true,
      created_at: new Date().toISOString(),
    };

    // Invoca o model, onde este ira inserir um novo elemento na tabela user com os atributos igual ao do objeto
    return await UserModel.signup(user);
  }

  async login(email, password) {
    // retorna o usuario encontrado pelo email

    const user = await UserModel.login(email);

    if (user) {
      const passwordDecrypt = decrypt(user.password.S);

      if (password === passwordDecrypt) {
        user.token = generateJWT(user.id, user.role);
        return user;
      }
    }

    return null;
  }
}

export default new UserService();
