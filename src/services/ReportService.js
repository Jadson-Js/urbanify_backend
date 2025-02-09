// Setup inicial
import crypto from "crypto";
import { readFileSync, unlinkSync } from "fs";
import path from "path";
import ReportModel from "../models/ReportModel.js";
import { generateGeohash } from "../utils/geohash.js";

class ReportService {
  async processReport(data) {
    const report = await this.getByLocal(
      data.report.district,
      data.report.coordinates.latitude,
      data.report.coordinates.longitude
    );

    await this.uploadFile(data);

    if (!report) {
      return await this.create(data);
    } else {
      return await this.update(data, report);
    }
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

  async create(data) {
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
    return await ReportModel.create(putData);
  }

  async update(data, reportFather) {
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
    return await ReportModel.update(putData, reportFather);
  }
}

export default new ReportService();
