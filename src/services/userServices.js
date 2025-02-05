// Setup inicial
import { generateJWT } from "../utils/jwt.js";
import crypto from "crypto";
import { encrypt, decrypt } from "../utils/crypto.js";
import { insertUser, selectUserByEmail } from "../models/userModels.js";

// Encripta a senha do usuario, e monta o objeto com os seus atributo.
export const saveUser = async (userData) => {
  const passwordEncrypt = encrypt(userData.password);

  const user = {
    id: crypto.randomBytes(32).toString("hex"),
    email: userData.email,
    password: passwordEncrypt,
    role: "user",
    active: true,
    created_at: new Date().toISOString(),
  };

  // Invoca o model, onde este ira inserir um novo elemento na tabela user com os atributos igual ao do objeto
  return await insertUser(user);
};

// Encontra o usuario validando sua senha e defini o token ao objeto usuario
export const findUser = async (email, password) => {
  // retorna o usuario encontrado pelo email
  const user = await selectUserByEmail(email);

  if (user) {
    const passwordDecrypt = decrypt(user.password);

    if (password === passwordDecrypt) {
      user.token = generateJWT(user.id, user.role);
      return user;
    }
  }
  return null;
};
