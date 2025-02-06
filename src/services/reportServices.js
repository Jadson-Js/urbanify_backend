// Setup inicial
import crypto from "crypto";
import { readFileSync, unlinkSync } from "fs";
import { insertReport, insertFileToS3 } from "../models/reportModels.js";

const saveFileToUpload = async (data) => {
  const photo = data.photo;

  const file = readFileSync(photo.path); // ler o arquivo enviado no req

  // trata o objeto definindo seus atributos
  const putData = {
    Bucket: process.env.S3_BUCKET,
    Key: photo.filename,
    StorageClass: "STANDARD",
    Body: file,
  };

  // apaga o arquvio no diretorio uploads
  unlinkSync(photo.path);

  // Invoca o model, para inserir um novo objeto no S3
  return await insertFileToS3(putData);
};

const saveReport = async (data) => {
  const photo = data.photo;
  const report = data.report;

  const putData = {
    id: crypto.randomBytes(32).toString("hex"),
    status: "Reportado",
    created_at: new Date().toISOString(),
    coordinates: {
      latitude: report.coordinates.latitude,
      longitude: report.coordinates.longitude,
    },
    address: {
      district: report.district,
      street: report.street,
    },
    childrens: [
      {
        user_id: report.user_id,
        s3_photo_key: photo.filename,
        severity: report.severity,
        created_at: new Date().toISOString(),
        coordinates: {
          latitude: report.coordinates.latitude,
          longitude: report.coordinates.longitude,
        },
      },
    ],
    // mais tarde, quando a obra for concluida, havera um novo atributo chamado "s3_registration_key"
  };

  // Invoca o model, onde este ira inserir um novo elemento na tabela user com os atributos igual ao do objeto
  return await insertReport(putData);
};

export { saveReport, saveFileToUpload };
