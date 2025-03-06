import crypto from "crypto";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { sesSource, snsARN } from "../config/environment.js";
import { generateJWT, generateAccessToken } from "../utils/jwt.js";
import { encrypt, decrypt } from "../utils/crypto.js";
import UserModel from "../models/UserModel.js";
import ResetCodeModel from "../models/ResetCodeModel.js";
import AppError from "../utils/AppError.js";

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

    // Fazer validação para saber se a conta deste user está ativo

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

    const params = {
      Destination: {
        ToAddresses: [email],
      },
      Message: {
        Body: {
          Html: {
            Data: `
              <html>
                <body>
                  <h1>Confirmação de email</h1>
                  <p>Olá! Para concluir o seu email, clique no link abaixo:</p>
                  <a href="http://localhost:3000/user/verify/email-token/${token.access}">Clique aqui para confirmar seu email</a>
                </body>
              </html>
            `,
          },
        },
        Subject: { Data: "Confirmar email" },
      },
      Source: sesSource,
    };
    console.log(params.Message.Body.Html.Data);

    await UserModel.sendEmail(params);
  }

  async verifyToken(token) {
    jwt.verify(token, process.env.JWT_SECRET_ACCESS, async (error, decoded) => {
      if (error) {
        throw new AppError(
          400,
          "Token invalido",
          "O token enviado era invalido"
        );
      } else {
        await UserModel.active(decoded.email);
      }
    });
  }

  async access(refreshToken) {
    const accessToken = await generateAccessToken(refreshToken);

    return accessToken;
  }

  async sendCodeToResetPassword(email) {
    const user = await UserModel.getByEmail(email);
    if (!user) {
      throw new AppError(
        404,
        "Usuario não encontrado",
        "Email incorreto ou inexistente"
      );
    }

    const data = {
      email,
      code: Math.floor(100000 + Math.random() * 900000).toString(),
      created_at: new Date().toISOString(),
    };
    await ResetCodeModel.create(data);

    const content = {
      Message: "Codigo de reset de senha", // O corpo do email
      Subject: "O codigo é " + data.code, // O assunto
      TopicArn: snsARN,
    };
    await UserModel.sendEmail(content);

    return { email: data.email, created_at: data.created_at };
  }

  async authCodeToResetPassword(params) {
    const { email, password, code, created_at } = params;

    const user = await UserModel.getByEmail(email);
    if (!user) {
      throw new AppError(
        404,
        "Usuario não encontrado",
        "Email incorreto ou inexistente"
      );
    }

    // Puxa o resetCode, chamando resetCodeModel informando email e created
    const resetCode = await ResetCodeModel.getByKeys(email, created_at);

    if (!resetCode) {
      throw new AppError(
        404,
        "Reset code não encontrado",
        "Email ou created_at incorreto ou inexistente"
      );
    } else if (resetCode.code !== code) {
      throw new AppError(
        400,
        "Reset code não é valido",
        "Reset code informado está incorreto"
      );
    } else {
      await UserModel.updatePassword(email, encrypt(password));
      await ResetCodeModel.delete(email, created_at);
    }
  }
}

export default new UserService();
