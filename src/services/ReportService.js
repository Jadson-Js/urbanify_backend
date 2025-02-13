import crypto from "crypto";
import sharp from "sharp";

import ReportModel from "../models/ReportModel.js";
import UserModel from "../models/UserModel.js";

import { generateGeohash } from "../utils/geohash.js";
import { userExist } from "../utils/userExist.js";
import { getIndexChildren } from "../utils/getIndexChildren.js";
import { getChildrenInReport } from "../utils/getChildrenInReport.js";

export default class ReportService {
  constructor(data = undefined) {
    if (data && data.user_email) {
      this.user_email = data.user_email;
    }

    // muito generico
    if (data && data.body) {
      this.body = data.body;
    }

    if (data && data.file) {
      this.file = data.file;
      this.key = `${new Date().toISOString()}-${data.file.originalname}`;
    }

    if (data && data.report) {
      this.report = data.report;
      this.address = `${data.report.subregion}_${data.report.district}`;
      this.reportFormated = this.formatDataToReport();
      this.childrenFormated = this.formatDataToChildren();
    }
  }

  async get() {
    const reports = await ReportModel.get();

    return reports;
  }

  async getMyReports() {
    const user = await UserModel.getByEmail(this.user_email);
    const reportList = user.reports_id.L.map((item) => item.S);
    const reports = await ReportModel.getByListId(reportList);

    const childrens = getChildrenInReport(this.user_email, reports);

    return childrens;
  }

  async processCreate() {
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

      // Enviar o arquivo para o S3
      await this.uploadFile(newReport.id);

      // Vai chamar um model onde vai informar os parametros email & report_id
      await UserModel.addReport(this.user_email, newReport.id);

      // adiciona o children ao report e retornar os dados
      return await this.addChildren();

      // Se existir um report na região
    } else {
      // Verifica esse usuario ja fez report no mesmo local
      const userExist = await this.verifyUserExist(report.id.S);

      if (userExist) {
        return "Usuario ja reportou anteriormente";
      }

      const childrensLength = report.childrens.L.length;

      // Verifica se este report tem mais de 3 filhos
      if (childrensLength < 3) {
        // Se tiver, ele faz o upload da fotografia para o report
        await this.uploadFile(report.id.S);
      }

      await UserModel.addReport(this.user_email, report.id.S);
      // Adiciona-se o report como filho
      return await this.addChildren();
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
      user_email: this.user_email,
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

  async verifyUserExist(report_id) {
    const user = await UserModel.getByEmail(this.user_email);

    return userExist(user, report_id);
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

    const newChildren = await ReportModel.addChildren(children, report);

    const report_id = { id: newChildren.Attributes.id };

    return report_id;
  }

  async processDelete() {
    const user_email = this.user_email;
    const { address, geohash } = this.body;

    const report = await ReportModel.getByLocal(address, geohash);

    if (!report) {
      return "Report não encontrado";
    }

    const index = getIndexChildren(user_email, report);

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
