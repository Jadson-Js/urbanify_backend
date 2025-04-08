// IMPORTANDO DEPENDENCIAS
import crypto from "crypto";
import dotenv from "dotenv";

// IMPORTANDO UTILS
import JWT from "../utils/JWT.js";
import { encrypt, decrypt } from "../utils/crypto.js";
import AppError from "../utils/AppError.js";

// IMPORTANDO MODELS
import UserModel from "../models/UserModel.js";

// SETUP
dotenv.config();

class UserService {
  async get() {
    const users = await UserModel.get();

    const formatedUsers = users.map((user) => {
      const { created_at, reports_id, service_counter } = user;

      return { created_at, report_counter: reports_id.length, service_counter };
    });

    return formatedUsers;
  }

  async signup(email) {
    const user = {
      id: crypto.randomUUID(),
      email: email,
      role: "USER",
      active: true,
      reports_id: [],
      service_counter: 0,
      created_at: new Date().toISOString(),
    };

    await UserModel.signup(user);

    return { id: user.id, email: user.email };
  }

  async signupOLD(email, password) {
    const passwordEncrypt = encrypt(password);
    const user = {
      id: crypto.randomUUID(),
      email: email,
      password: passwordEncrypt,
      role: "USER",
      active: true,
      reports_id: [],
      service_counter: 0,
      created_at: new Date().toISOString(),
    };

    await UserModel.signup(user);

    return { id: user.id, email: user.email };
  }

  async login(email) {
    const user = await this.verifyUserExist(email);

    if (user.active == false) {
      throw new AppError(
        401, // Código de status apropriado para erros de autorização
        "User email is pending",
        "User email is pending."
      );
    }

    user.token = JWT.generate(user);
    return user;
  }

  async loginOLD(email, password) {
    const user = await this.verifyUserExist(email);

    if (user.active == false) {
      throw new AppError(
        401, // Código de status apropriado para erros de autorização
        "User email is pending",
        "User email is pending."
      );
    }

    const passwordDecrypt = decrypt(user.password);

    if (password === passwordDecrypt) {
      user.token = JWT.generate(user);
      return user;
    }
  }

  async generateAccessToken(refreshToken) {
    const accessToken = JWT.generateAccess(refreshToken);

    return accessToken;
  }

  async authGoogle(authToken) {
    const email_user = await UserModel.authGoogle(authToken);

    console.log(email_user);
    const user = await UserModel.getByEmail(email_user);

    if (!user) await this.signup(email_user);

    const response = this.login(email_user);

    return response;
  }

  // UTILS PARA A CLASSE
  async verifyUserExist(email) {
    const user = await UserModel.getByEmail(email);

    if (!user) {
      throw new AppError(
        404, // Código de status apropriado para recursos ou usuários não encontrados
        "User not found",
        "Incorrect or non-existent email."
      );
    }

    return user;
  }
}

export default new UserService();
