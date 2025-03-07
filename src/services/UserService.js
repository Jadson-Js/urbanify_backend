// IMPORTANDO DEPENDENCIAS
import crypto from "crypto";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

// IMPORTANDO UTILS
import { generateJWT, generateAccessToken } from "../utils/jwt.js";
import { encrypt, decrypt } from "../utils/crypto.js";
import verifyToken from "../utils/verifyJwt.js";
import Tamplate from "../utils/tamplatesEmail.js";
import AppError from "../utils/AppError.js";

// IMPORTANDO MODELS
import UserModel from "../models/UserModel.js";

// SETUP
dotenv.config();

class UserService {
  async login(email, password) {
    const user = await UserModel.getByEmail(email);

    if (!user) {
      throw new AppError(
        404,
        "Usuario não encontrado",
        "Email incorreto ou inexistente"
      );
    }

    if (user.active == false) {
      throw new AppError(
        401,
        "Email do usuario está pendente",
        "Email do usuario está pendente"
      );
    }

    const passwordDecrypt = decrypt(user.password);

    if (password === passwordDecrypt) {
      user.token = generateJWT(user);
      return user;
    }
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
      created_at: new Date().toISOString(),
    };

    await this.sendConfirmEmail(email, user);

    return await UserModel.signup(user);
  }

  async sendConfirmEmail(email, user) {
    const token = generateJWT(user);

    const params = Tamplate.confirmEmail(email, token);
    console.log(params.Message.Body.Html.Data);

    await UserModel.sendEmail(params);
  }

  async verifyEmailToken(token) {
    const response = jwt.verify(
      token,
      process.env.JWT_SECRET_ACCESS,
      async (error, decoded) => {
        if (error) {
          throw new AppError(
            400,
            "Token invalido",
            "O token enviado era invalido"
          );
        } else {
          return await UserModel.active(decoded.email);
        }
      }
    );

    return response;
  }

  async access(refreshToken) {
    const accessToken = await generateAccessToken(refreshToken);

    return accessToken;
  }

  async sendEmailToResetPassword(email) {
    const user = await UserModel.getByEmail(email);
    if (!user) {
      throw new AppError(
        404,
        "Usuario não encontrado",
        "Email incorreto ou inexistente"
      );
    }

    const params = Tamplate.resetPasswordEmail(email, generateJWT(user));

    return await UserModel.sendEmail(params);
  }

  async formToResetPassword(token) {
    // Valide o token com o util verifyToken
    await verifyToken(token);

    return Tamplate.resetPasswordEmailForm(token);
    //retorna o tamplate com o formulario para resetar a senha
  }

  async resetPassword(data) {
    await UserModel.updatePassword(data.user_email, encrypt(data.new_password));
  }
}

export default new UserService();
