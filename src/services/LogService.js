// Setup inicial
import LogModel from "../models/LogModel.js";
import crypto from "crypto";

class LogService {
  // Encontra o usuario validando sua senha e defini o token ao objeto usuario
  async get() {
    // retorna o usuario encontrado pelo email
    const logs = await LogModel.get();

    return logs;
  }

  async create(data) {
    const log = {
      id: crypto.randomBytes(32).toString("hex"),
      created_at: new Date().toISOString(),
      report_count: data.report_count,
      status: data.status,
      district: data.district,
      street: data.street,
    };

    // Invoca o model, onde este ira inserir um novo elemento na tabela user com os atributos igual ao do objeto
    return await LogModel.create(log);
  }
}

// Encripta a senha do usuario, e monta o objeto com os seus atributo.
export default new LogService();
