// Setup inicial
import crypto from "crypto";
import { readFileSync, unlinkSync } from "fs";
import path from "path";
import ReportModel from "../models/ReportModel.js";
import { generateGeohash } from "../utils/geohash.js";

class ReportService {
  async processReport(data) {
    await this.uploadFile(data);

    const childrenFormated = this.formatDataToChildren(data);
    const reportFormated = this.formatDataToReport(data);

    const report = await this.getByLocal(
      data.report.district,
      data.report.coordinates.latitude,
      data.report.coordinates.longitude
    );

    if (!report) {
      await ReportModel.create(reportFormated);
    }

    return await ReportModel.addChildren(childrenFormated, reportFormated);

    // Ja tenho o children formatado, agora falta saber se esse vai se criar um novo report ou inseri-lo em um ja existente
  }

  formatDataToChildren(data) {
    const { pathFile } = data;
    const { user_id, severity, coordinates } = data.report;

    const children = {
      user_id: user_id,
      s3_photo_key: path.basename(pathFile),
      severity: severity,
      created_at: new Date().toISOString(),
      coordinates: {
        latitude: coordinates.latitude,
        longitude: coordinates.longitude,
      },
    };

    return children;
  }

  formatDataToReport(data) {
    const { district, street, coordinates } = data.report;

    const putData = {
      id: crypto.randomBytes(32).toString("hex"),
      status: "Reportado",
      created_at: new Date().toISOString(),
      district: district,
      street: street,
      geohash: generateGeohash(coordinates.latitude, coordinates.longitude),
      coordinates: {
        latitude: coordinates.latitude,
        longitude: coordinates.longitude,
      },
      childrens: [],
    };

    return putData;
  }

  async getByLocal(district, latitude, longitude) {
    const geohash = generateGeohash(latitude, longitude);

    return ReportModel.getByLocal(district, geohash);
  }

  async uploadFile(data) {
    const pathFile = data.pathFile;

    // trata o objeto definindo seus atributos
    const putData = {
      Bucket: process.env.S3_BUCKET,
      Key: path.basename(pathFile),
      StorageClass: "STANDARD",
      Body: readFileSync(pathFile),
    };

    // Invoca o model, para inserir um novo objeto no S3
    await ReportModel.uploadFile(putData);

    unlinkSync(pathFile);
  }
}

export default new ReportService();
