// Setup inicial
import crypto from "crypto";
import { readFileSync, unlinkSync } from "fs";
import {
  scanReportByGeo,
  insertFileToS3,
  insertReport,
  updateReport,
} from "../models/reportModels.js";
import path from "path";
import { generateGeohash } from "../utils/geohash.js";

const findReportByGeo = async (district, latitude, longitude) => {
  const geohash = generateGeohash(latitude, longitude);

  return scanReportByGeo(district, geohash);
};

const saveFileToUpload = async (data) => {
  const pathFile = data.pathFile;

  // trata o objeto definindo seus atributos
  const putData = {
    Bucket: process.env.S3_BUCKET,
    Key: path.basename(pathFile),
    StorageClass: "STANDARD",
    Body: readFileSync(pathFile),
  };

  // Invoca o model, para inserir um novo objeto no S3
  await insertFileToS3(putData);
  unlinkSync(pathFile);
};

const saveReport = async (data) => {
  const pathFile = data.pathFile;
  const report = data.report;

  const putData = {
    id: crypto.randomBytes(32).toString("hex"),
    status: "Reportado",
    created_at: new Date().toISOString(),
    district: report.district,
    street: report.street,
    geohash: generateGeohash(
      report.coordinates.latitude,
      report.coordinates.longitude
    ),
    coordinates: {
      latitude: report.coordinates.latitude,
      longitude: report.coordinates.longitude,
    },
    childrens: [
      {
        user_id: report.user_id,
        s3_photo_key: path.basename(pathFile),
        severity: report.severity,
        created_at: new Date().toISOString(),
        coordinates: {
          latitude: report.coordinates.latitude,
          longitude: report.coordinates.longitude,
        },
      },
    ],
  };

  // Invoca o model, onde este ira inserir um novo elemento na tabela user com os atributos igual ao do objeto
  return await insertReport(putData);
};

async function saveChildrenReport(data, reportFather) {
  const pathFile = data.pathFile;
  const report = data.report;

  const putData = {
    user_id: report.user_id,
    s3_photo_key: path.basename(pathFile),
    severity: report.severity,
    created_at: new Date().toISOString(),
    coordinates: {
      latitude: report.coordinates.latitude,
      longitude: report.coordinates.longitude,
    },
  };

  // Invoca o model, onde este ira inserir um novo elemento na tabela user com os atributos igual ao do objeto
  return await updateReport(putData, reportFather);
}

export { findReportByGeo, saveReport, saveFileToUpload, saveChildrenReport };
