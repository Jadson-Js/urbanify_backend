import crypto from "crypto";
import { snsARN } from "../config/environment.js";
import { generateJWT, generateAccessToken } from "../utils/jwt.js";
import { encrypt, decrypt } from "../utils/crypto.js";
import UserModel from "../models/UserModel.js";
import ResetCodeModel from "../models/ResetCodeModel.js";
import AppError from "../utils/AppError.js";

class UserService {
  async signup(email, password) {
    const passwordEncrypt = encrypt(password);
    const params = {
      Protocol: "email",
      Endpoint: email,
      TopicArn: snsARN,
    };

    await UserModel.snsSubscribe(params);

    const user = {
      id: crypto.randomUUID(),
      email: email,
      password: passwordEncrypt,
      role: "USER",
      active: false,
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
    }

    const params = {
      user_email: user.email,
      topic_arn: snsARN,
    };

    const status = await UserModel.isSubscribe(params);

    if (status.SubscriptionArn == "PendingConfirmation") {
      throw new AppError(
        401,
        "Email do usuario está pendente",
        "Email do usuario está pendente"
      );
    } else if (user.active == false) {
      // Chama model que deixa o active do usuario igual a true
      await UserModel.active(user.email);
    }

    const passwordDecrypt = decrypt(user.password);

    if (password === passwordDecrypt) {
      user.token = generateJWT(user);
      return user;
    }
  }

  async access(refreshToken) {
    const accessToken = await generateAccessToken(refreshToken);

    return accessToken;
  }

  async getCodeToResetPassword(email) {
    const user = await UserModel.getByEmail(email);

    if (!user) {
      throw new AppError(
        404,
        "Usuario não encontrado",
        "Email incorreto ou inexistente"
      );
    }

    const data = {
      email: email,
      code: Math.floor(100000 + Math.random() * 900000),
      created_at: new Date().toISOString(),
    };
    await ResetCodeModel.create(data);

    const content = {
      Message: "Codigo de reset de senha", // O corpo do email
      Subject: "O codigo é " + data.code, // O assunto
      TopicArn: snsARN,
    };

    const sendEmail = await UserModel.sendEmail(content);

    return sendEmail;
  }
}

export default new UserService();
