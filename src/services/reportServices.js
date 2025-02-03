// Setup inicial
import crypto from "crypto";
import { readFileSync, unlinkSync } from "fs";
import { insertReport, insertFileToS3 } from "../models/reportModels.js";

// Encripta a senha do usuario, e monta o objeto com os seus atributo.
const saveReport = async (reportData) => {
  const report = {
    id: crypto.randomBytes(32).toString("hex"),
    registration_url: null,
    severity: reportData.severity,
    status: 1,
    user_id: reportData.user_id,
    geolocation: reportData.geolocation,
    photo_key: reportData.photo_name,
    created_at: new Date().toISOString(),
  };

  // Invoca o model, onde este ira inserir um novo elemento na tabela user com os atributos igual ao do objeto
  return await insertReport(report);
};

const saveFileToUpload = async (filePath, fileName) => {
  const file = readFileSync(filePath);
  const putData = {
    Bucket: process.env.S3_BUCKET,
    Key: fileName,
    StorageClass: "STANDARD",
    Body: file,
  };

  unlinkSync(filePath);

  return await insertFileToS3(putData);
};

export { saveReport, saveFileToUpload };
