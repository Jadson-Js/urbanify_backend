import crypto from "crypto";
import { readFileSync, unlinkSync } from "fs";
import path from "path";
import ReportModel from "../models/ReportModel.js";
import { generateGeohash } from "../utils/geohash.js";
import { userExist } from "../utils/userExist.js";
import { getIndexChildren } from "../utils/getIndexChildren.js";

export default class ReportService {
  constructor(data = undefined) {
    if (data) {
      (this.user_id = data.user_id),
        (this.report = data.report),
        (this.address = `${data.report.subregion}_${data.report.district}`),
        (this.pathFile = data.pathFile),
        (this.reportFormated = this.formatDataToReport()),
        (this.childrenFormated = this.formatDataToChildren());
    }
  }

  async processCreate() {
    const { coordinates } = this.report;

    const report = await this.getByLocal(
      this.address,
      coordinates.latitude,
      coordinates.longitude
    );

    if (!report) {
      await this.create();
      await this.uploadFile();
      await this.addChildren();
    } else {
      const childrensLength = report.childrens.L.length;

      if (userExist(this.user_id, report)) {
        return "Usuário já reportou anteriormente";
      }

      if (childrensLength < 3) {
        await this.uploadFile();
      }

      await this.addChildren();
    }
  }

  formatDataToReport() {
    const { subregion, district, street, coordinates } = this.report;

    const report_id = crypto.randomBytes(32).toString("hex");
    const address = `${subregion}_${district}`;

    const putData = {
      id: report_id,
      status: "REPORTADO",
      created_at: new Date().toISOString(),
      address: address,
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
    const { severity, coordinates } = this.report;

    const putData = {
      user_id: this.user_id,
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

  async getByLocal() {
    const { coordinates } = this.report;

    const geohash = generateGeohash(
      coordinates.latitude,
      coordinates.longitude
    );

    return ReportModel.getByLocal(this.address, geohash);
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

  async create() {
    const report = this.reportFormated;

    await ReportModel.create(report);
  }

  async addChildren() {
    const report = this.reportFormated;
    const children = this.childrenFormated;

    ReportModel.addChildren(children, report);
  }

  async processDelete(user_id, data) {
    const { address, geohash } = data;

    const report = await ReportModel.getByLocal(address, geohash);

    const index = getIndexChildren(user_id, report);

    return await ReportModel.removeChildren(index, address, geohash);
  }
}
