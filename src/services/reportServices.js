// Setup inicial
import crypto from "crypto";
import { readFileSync, unlinkSync } from "fs";
import { insertReport, insertFileToS3 } from "../models/reportModels.js";

const saveReport = async (data, s3_photo_key) => {
  const report = {
    id: crypto.randomBytes(32).toString("hex"),
    status: "Reportado",
    created_at: new Date().toISOString(),
    neighborhood: data.neighborhood,
    street: data.street,
    coordinates: {
      latitude: data.coordinates.latitude,
      longitude: data.coordinates.longitude,
    },
    users: [
      {
        id: data.id,
        s3_photo_key: s3_photo_key,
        severity: data.severity,
        created_at: new Date().toISOString(),
        coordinates: {
          latitude: data.coordinates.latitude,
          longitude: data.coordinates.longitude,
        },
      },
    ],
    // mais tarde, quando a obra for concluida, havera um novo atributo chamado "s3_registration_key"
  };

  // Invoca o model, onde este ira inserir um novo elemento na tabela user com os atributos igual ao do objeto
  return await insertReport(report);
};

const saveFileToUpload = async (filePath, fileName) => {
  const file = readFileSync(filePath); // ler o arquivo enviado no req

  // trata o objeto definindo seus atributos
  const putData = {
    Bucket: process.env.S3_BUCKET,
    Key: fileName,
    StorageClass: "STANDARD",
    Body: file,
  };

  // apaga o arquvio no diretorio uploads
  unlinkSync(filePath);

  // Invoca o model, para inserir um novo objeto no S3
  return await insertFileToS3(putData);
};

export { saveReport, saveFileToUpload };
