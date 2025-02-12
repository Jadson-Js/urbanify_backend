import crypto from "crypto";
import sharp from "sharp";
import stream from "stream";

import ReportModel from "../models/ReportModel.js";

import { generateGeohash } from "../utils/geohash.js";
import { userExist } from "../utils/userExist.js";
import { getIndexChildren } from "../utils/getIndexChildren.js";

export default class ReportService {
  constructor(data = undefined) {
    if (data.user_id) {
      this.user_id = data.user_id;
    }

    if (data.body) {
      this.body = data.body;
    }

    if (data.file) {
      this.file = data.file;
      this.key = `${new Date().toISOString()}-${data.file.originalname}`;
    }

    if (data.report) {
      this.report = data.report;
      this.address = `${data.report.subregion}_${data.report.district}`;
      this.reportFormated = this.formatDataToReport();
      this.childrenFormated = this.formatDataToChildren();
    }
  }

  async processCreate() {
    // Pega as coordenadas do report
    const { coordinates } = this.report;

    // Faz uma busca para saber se existe algum report existente no local requisitado
    const report = await this.getByLocal(
      this.address,
      coordinates.latitude,
      coordinates.longitude
    );

    // Se não existir nenhum report anterior
    if (!report) {
      const newReport = await this.create();

      await this.uploadFile(newReport.id);
      await this.addChildren();

      // Se existir um report na região
    } else {
      if (userExist(this.user_id, report)) {
        return "Usuário já reportou anteriormente";
      }

      const childrensLength = report.childrens.L.length;

      // Verifica se este tem mais de 3 filhos
      if (childrensLength < 3) {
        // Se tiver, ele faz o upload da fotografia para o report

        await this.uploadFile(report.id.S);
      }

      // Adiciona-se o report como filho
      await this.addChildren();
    }
  }

  formatDataToReport() {
    const { street, coordinates } = this.report;

    const report_id = crypto
      .randomBytes(12)
      .toString("base64")
      .replace(/\W/g, "");

    const putData = {
      id: report_id,
      status: "REPORTADO",
      created_at: new Date().toISOString(),
      address: this.address,
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
      // Talvez no futuro, vc precise adicionar o prefixo (id do report)
      s3_photo_key: this.key,
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

  async uploadFile(report_id) {
    // Processa a imagem com Sharp (redimensiona e comprime)
    const image = sharp(this.file.buffer)
      .resize(800) // Redimensiona para 800px
      .jpeg({ quality: 10 }) // Comprime para JPEG qualidade 80
      .toString("base64");

    const putData = {
      Bucket: process.env.S3_BUCKET,
      Key: `${report_id}/${this.key}`,
      StorageClass: "STANDARD",
      Body: image,
    };

    return await ReportModel.uploadFile(putData);
  }

  async create() {
    const report = this.reportFormated;

    return await ReportModel.create(report);
  }

  async addChildren() {
    const report = this.reportFormated;
    const children = this.childrenFormated;

    return ReportModel.addChildren(children, report);
  }

  async processDelete() {
    const user_id = this.user_id;
    const { address, geohash } = this.body;

    const report = await ReportModel.getByLocal(address, geohash);
    const index = getIndexChildren(user_id, report);

    const childrensLength = report.childrens.L.length;

    if (childrensLength == 1 && index != -1) {
      await this.deleteFilesByPrefix(report.id.S);
      return await ReportModel.delete(address, geohash);
    } else if (index != -1) {
      return await ReportModel.removeChildren(index, address, geohash);
    } else {
      return "Children não encontrado";
    }
  }

  async deleteFilesByPrefix(prefix) {
    const paramsToGet = {
      Bucket: process.env.S3_BUCKET,
      Prefix: prefix,
    };

    const listFiles = await ReportModel.getFilesByPrefix(paramsToGet);

    const paramsToDelete = {
      Bucket: process.env.S3_BUCKET,
      Delete: {
        Objects: listFiles.Contents.map((obj) => ({ Key: obj.Key })),
      },
    };

    return await ReportModel.deleteFiles(paramsToDelete);
  }
}
