// Setup inicial
import crypto from "crypto";
import { readFileSync, unlinkSync } from "fs";
import { insertReport, insertFileToS3 } from "../models/reportModels.js";

const saveReport = async (data, s3_photo_key) => {
  // const report = {
  //   id: crypto.randomBytes(32).toString("hex"), // Encripta a senha do usuario, e monta o objeto com os seus atributo.
  //   registration_url: null,
  //   severity: reportData.severity,
  //   status: 1,
  //   user_id: reportData.user_id,
  //   geolocation: reportData.geolocation,
  //   photo_key: reportData.photo_name,
  //   created_at: new Date().toISOString(),
  // };

  const report = {
    id: crypto.randomBytes(32).toString("hex"),
    users: [
      {
        user_id: data.user_id,
        user_coordinates: {
          lat: data.user_coordinates.lat,
          long: data.user_coordinates.long,
        },
        s3_photo_key: s3_photo_key,
        severity: data.report_severity,
      },
    ],
    coordinates: {
      lat: data.user_coordinates.lat,
      long: data.user_coordinates.long,
    },
    status: "Reportado",
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
