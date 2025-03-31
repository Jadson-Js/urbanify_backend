// IMPORTANDO DEPENDENCIAS
import crypto from "crypto";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

// IMPORTANDO UTILS
import JWT from "../utils/JWT.js";
import { encrypt, decrypt } from "../utils/crypto.js";
import Tamplate from "../utils/Tamplate.js";
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

  async signup(email, password) {
    const passwordEncrypt = encrypt(password);
    const user = {
      id: crypto.randomUUID(),
      email: email,
      password: passwordEncrypt,
      role: "USER",
      active: false,
      reports_id: [],
      service_counter: 0,
      created_at: new Date().toISOString(),
    };

    await this.sendConfirmEmail(email, user);

    await UserModel.signup(user);

    return { id: user.id, email: user.email };
  }

  async sendConfirmEmail(email, user) {
    const token = JWT.generate(user);

    const params = Tamplate.emailConfirm(email, token);

    await UserModel.sendEmail(params);
  }

  async verifyEmailToken(accessToken) {
    jwt.verify(
      accessToken,
      process.env.JWT_SECRET_ACCESS,
      async (error, decoded) => {
        if (error) {
          throw new AppError(
            400, // Código de status apropriado para entrada de dados inválida
            "Invalid token",
            "The token sent was invalid."
          );
        } else {
          await UserModel.active(decoded.email);
        }
      }
    );

    const response = Tamplate.responseConfirmEmail();

    return response;
  }

  async login(email, password) {
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

  async sendEmailToResetPassword(email) {
    const user = await this.verifyUserExist(email);

    const params = Tamplate.emailResetPassword(email, JWT.generateJWT(user));

    return await UserModel.sendEmail(params);
  }

  async formToResetPassword(token) {
    await JWT.verify(token);

    return Tamplate.responseResetPasswordForm(token);
  }

  async resetPassword(data) {
    await UserModel.updatePassword(data.user_email, encrypt(data.new_password));
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
