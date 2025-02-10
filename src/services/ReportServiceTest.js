import crypto from "crypto";
import { readFileSync, unlinkSync } from "fs";
import path from "path";
import ReportModel from "../models/ReportModel.js";
import { generateGeohash } from "../utils/geohash.js";

export default class ReportService {
  constructor(data) {
    (this.report = data.report),
      (this.pathFile = data.pathFile),
      (this.reportFormated = this.formatDataToReport()),
      (this.childrenFormated = this.formatDataToChildren());

    this.processReport();
  }

  async processReport() {
    const { district, coordinates } = this.report;

    await this.uploadFile();

    const report = await this.getByLocal(
      district,
      coordinates.latitude,
      coordinates.longitude
    );

    if (!report) {
      await this.create();
    }

    return await this.addChildren();
  }

  formatDataToReport() {
    const { district, street, coordinates } = this.report;

    const putData = {
      id: crypto.randomBytes(32).toString("hex"),
      status: "REPORTADO",
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

  formatDataToChildren() {
    const { user_id, severity, coordinates } = this.report;

    const putData = {
      user_id: user_id,
      s3_photo_key: path.basename(this.pathFile),
      severity: severity,
      created_at: new Date().toISOString(),
      coordinates: {
        latitude: coordinates.latitude,
        longitude: coordinates.longitude,
      },
    };

    return putData;
  }

  async uploadFile() {
    const putData = {
      Bucket: process.env.S3_BUCKET,
      Key: path.basename(this.pathFile),
      StorageClass: "STANDARD",
      Body: readFileSync(this.pathFile),
    };

    await ReportModel.uploadFile(putData);

    unlinkSync(this.pathFile);
  }

  async getByLocal() {
    const { district, coordinates } = this.report;

    const geohash = generateGeohash(
      coordinates.latitude,
      coordinates.longitude
    );

    return ReportModel.getByLocal(district, geohash);
  }

  async create() {
    const report = this.reportFormated;

    await ReportModel.create(report);
  }

  async addChildren() {
    const report = this.reportFormated;
    const children = this.childrenFormated;

    console.log(report);
    console.log(children);

    ReportModel.addChildren(children, report);
  }
}
