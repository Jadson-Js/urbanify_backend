// Setup inicial
import crypto from "crypto";
import { insertReport } from "../models/reportModels.js";

// Encripta a senha do usuario, e monta o objeto com os seus atributo.
export const saveReport = async (reportData) => {
  const report = {
    id: crypto.randomBytes(32).toString("hex"),
    photo_url: reportData.photo_url,
    registration_url: null,
    severity: reportData.severity,
    status: 1,
    user_id: reportData.user_id,
    geolocation: reportData.geolocation,
    street: reportData.street,
    postal_code: reportData.postal_code,
    created_at: new Date().toISOString(),
  };

  // Invoca o model, onde este ira inserir um novo elemento na tabela user com os atributos igual ao do objeto
  return await insertReport(report);
};
