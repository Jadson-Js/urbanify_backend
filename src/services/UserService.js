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
      reports_id: [],
      created_at: new Date().toISOString(),
    };

    return await UserModel.signup(user);
  }

  async login(email, password) {
    const user = await UserModel.login(email);

    if (user) {
      const passwordDecrypt = decrypt(user.password.S);

      if (password === passwordDecrypt) {
        user.token = generateJWT(user.email, user.role);
        return user;
      }
    }

    return null;
  }
}

export default new UserService();
