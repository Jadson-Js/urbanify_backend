// IMPORTANDO DEPENDENCIAS
import crypto from "crypto";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

// generateJWT
// generateAccessToken

// IMPORTANDO UTILS
import JWT from "../utils/JWT.js";
import { encrypt, decrypt } from "../utils/crypto.js";
import Tamplate from "../utils/tamplatesEmail.js";
import AppError from "../utils/AppError.js";

// IMPORTANDO MODELS
import UserModel from "../models/UserModel.js";

// SETUP
dotenv.config();

class UserService {
  async signup(email, password) {
    const passwordEncrypt = encrypt(password);
    const user = {
      id: crypto.randomUUID(),
      email: email,
      password: passwordEncrypt,
      role: "USER",
      active: false,
      reports_id: [],
      created_at: new Date().toISOString(),
    };

    await this.sendConfirmEmail(email, user);

    return await UserModel.signup(user);
  }

  async sendConfirmEmail(email, user) {
    const token = JWT.generateJWT(user);

    const params = Tamplate.emailConfirm(email, token);
    console.log(params.Message.Body.Html.Data);

    await UserModel.sendEmail(params);
  }

  async verifyEmailToken(accessToken) {
    jwt.verify(
      accessToken,
      process.env.JWT_SECRET_ACCESS,
      async (error, decoded) => {
        if (error) {
          throw new AppError(
            400,
            "Token invalido",
            "O token enviado era invalido"
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
        401,
        "Email do usuario está pendente",
        "Email do usuario está pendente"
      );
    }

    const passwordDecrypt = decrypt(user.password);

    if (password === passwordDecrypt) {
      user.token = JWT.generateJWT(user);
      return user;
    }
  }

  async generateAccessToken(refreshToken) {
    const accessToken = JWT.generateAccessToken(refreshToken);

    return accessToken;
  }

  async sendEmailToResetPassword(email) {
    const user = await this.verifyUserExist(email);

    const params = Tamplate.emailResetPassword(email, JWT.generateJWT(user));
    console.log(params.Message.Body.Html.Data);

    return await UserModel.sendEmail(params);
  }

  async formToResetPassword(token) {
    await JWT.verifyToken(token);

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
        404,
        "Usuario não encontrado",
        "Email incorreto ou inexistente"
      );
    }

    return user;
  }
}

export default new UserService();
