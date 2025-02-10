// Setup inicial
import crypto from "crypto";
import { readFileSync, unlinkSync } from "fs";
import path from "path";
import ReportModel from "../models/ReportModel.js";
import { generateGeohash } from "../utils/geohash.js";
import { userExist } from "../utils/userExist.js";

export default class ReportService {
  constructor(data) {
    (this.report = data.report),
      (this.address = `${data.report.subregion}_${data.report.district}`),
      (this.pathFile = data.pathFile),
      (this.reportFormated = this.formatDataToReport()),
      (this.childrenFormated = this.formatDataToChildren());

    this.processReport();
  }

  async processReport() {
    const { user_id, coordinates } = this.report;

    // Busca se existe um report na localização
    const report = await this.getByLocal(
      this.address,
      coordinates.latitude,
      coordinates.longitude
    );

    // Se não existir
    if (!report) {
      await this.create(); // Criar um report
      await this.uploadFile(); // Manda a imagem pro S3
      await this.addChildren(); // Cria um filho e anexa no report

      // Se ja houver um report na localização
    } else {
      // Verifica quantos filhos ja possui
      const childrensLength = report.childrens.L.length;

      // Verifica se o usuario está tentando reportar o mesmo local uma 2° vez
      if (userExist(user_id, report)) {
        return "Usuário já reportou anteriormente";
      }

      // Verifica se ja existe mais de 3 reports
      if (childrensLength < 3) {
        // Se ainda não houver, ele continuar a subir imagens como registros para o report
        await this.uploadFile();
      }

      // Criar um filho, e anexa ao report ja existente
      await this.addChildren();
    }

    // Ja tenho o children formatado, agora falta saber se esse vai se criar um novo report ou inseri-lo em um ja existente
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

    // Invoca o model, para inserir um novo objeto no S3
    await ReportModel.uploadFile(putData);

    unlinkSync(this.pathFile);
  }

  async getByLocal() {
    const { coordinates } = this.report;

    const geohash = generateGeohash(
      coordinates.latitude,
      coordinates.longitude
    );

    return ReportModel.getByLocal(this.address, geohash);
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
}
