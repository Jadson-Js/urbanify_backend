// Setup inicial
import { selectHistory, insertHistory } from "../models/historyModels.js";
import crypto from "crypto";
import { encrypt, decrypt } from "../utils/crypto.js";

// Encontra o usuario validando sua senha e defini o token ao objeto usuario
export const findHistory = async () => {
  // retorna o usuario encontrado pelo email
  const historical = await selectHistory();

  if (historical) {
    return historical;
  }
  return null;
};

// Encripta a senha do usuario, e monta o objeto com os seus atributo.
export const saveHistory = async (data) => {
  const history = {
    id: crypto.randomBytes(32).toString("hex"),
    created_at: new Date().toISOString(),
    report_count: data.report_count,
    status: data.status,
    adress: {
      district: data.district,
      street: data.street,
    },
  };

  // Invoca o model, onde este ira inserir um novo elemento na tabela user com os atributos igual ao do objeto
  return await insertHistory(history);
};
