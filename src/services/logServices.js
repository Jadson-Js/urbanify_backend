// Setup inicial
import { selectLogs, insertLog } from "../models/logModels.js";
import crypto from "crypto";

// Encontra o usuario validando sua senha e defini o token ao objeto usuario
export const findLogs = async () => {
  // retorna o usuario encontrado pelo email
  const logs = await selectLogs();

  if (logs) {
    return logs;
  }
  return null;
};

// Encripta a senha do usuario, e monta o objeto com os seus atributo.
export const saveLog = async (data) => {
  const log = {
    id: crypto.randomBytes(32).toString("hex"),
    created_at: new Date().toISOString(),
    report_count: data.report_count,
    status: data.status,
    district: data.district,
    street: data.street,
  };

  // Invoca o model, onde este ira inserir um novo elemento na tabela user com os atributos igual ao do objeto
  return await insertLog(log);
};
