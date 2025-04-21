// IMPORTANDO DEPENDENCIAS
import crypto from "crypto";
import sharp from "sharp";

// IMPORTANDO CONFIGS
import { ReportStatus, ReportSeverity } from "../config/environment.js";

// IMPORTANDO UTILS
import { generateGeohash } from "../utils/geohash.js";
import ChildrenInReport from "../utils/ChildrenInReport.js";
import AppError from "../utils/AppError.js";

// IMPORTANDO MODELS
import ReportModel from "../models/ReportModel.js";
import UserModel from "../models/UserModel.js";
import ResolvedReportModel from "../models/ResolvedModel.js";

export default class ReportService {
  // CONTRUTORES DA CLASSE
  constructor(data = {}) {
    this.user_email = data.user_email;
    this.local = data.local;
    this.date = new Date().toISOString();
    this.file = this.setFile(data);
    this.form = this.setForm(data);
    this.update = data.update;
    (this.reportFormated = {}), (this.childrenFormated = {});
  }

  setForm(data) {
    if (!data.form) {
      return undefined;
    }

    const { form } = data;
    form.address = `${form.subregion}_${form.district}`;

    return form;
  }

  setFile(data) {
    if (!data.file) {
      return undefined;
    }

    const file = {
      image: data.file,
      key: `${this.date}-${data.file.originalname}`,
    };

    return file;
  }

  formDataToReport() {
    const { subregion, district, address, street, coordinates } = this.form;

    const report_id = crypto
      .randomBytes(12)
      .toString("base64")
      .replace(/\W/g, "");

    const putData = {
      falseId: this.date,
      id: report_id,
      status: ReportStatus.REPORTADO,
      created_at: this.date,
      subregion,
      district,
      address,
      street,
      geohash: generateGeohash(coordinates.latitude, coordinates.longitude),
      coordinates: {
        ...coordinates,
      },
      childrens: [],
    };

    return putData;
  }

  formDataToChildren() {
    const { severity, coordinates } = this.form;

    const putData = {
      user_email: this.user_email,
      s3_photo_key: this.file.key,
      severity: ReportSeverity[severity],
      created_at: this.date,
      coordinates: { ...coordinates },
    };

    return putData;
  }

  // AÇÕES DE GET
  async get() {
    const reports = await ReportModel.get();

    const reportsFormatted = reports.map((report) => {
      const childrenFormatted = report.childrens.map(
        ({ user_email, severity, created_at }) => ({
          user_email,
          severity,
          created_at,
        }),
      );

      return {
        ...report,
        childrens: childrenFormatted,
      };
    });

    return reportsFormatted;
  }

  async getReport() {
    const { address, geohash } = this.local;
    const report = await this.verifyReportExist(address, geohash);

    const urls = await this.getPresignedUrl(report.id);

    return { report, urls };
  }

  async getMyReports() {
    const user = await UserModel.getByEmail(this.user_email);
    const reportList = user.reports_id;

    const reports = await ReportModel.getByListId(reportList);
    const childrens = ChildrenInReport.get(this.user_email, reports);

    return childrens;
  }

  async getStatus() {
    const { address, geohash } = this.local;
    const report = await this.verifyReportExist(address, geohash);

    const alreadyExist = ChildrenInReport.getIndex(this.user_email, report);

    if (alreadyExist === -1) {
      throw new AppError(
        401, // Código de status apropriado para erros de autorização
        "User not authorized",
        "The user is not authorized to access data for a report they are not part of.",
      );
    }

    return report.status;
  }

  async getPresignedUrl(prefix) {
    const paramsToGet = {
      Bucket: process.env.S3_BUCKET,
      Prefix: prefix,
    };

    const { Contents } = await ReportModel.getFilesByPrefix(paramsToGet);
    const urls = await ReportModel.getPresignedUrl(Contents);

    return urls;
  }

  async getByLocal() {
    const { address, coordinates } = this.form;

    const geohash = generateGeohash(
      coordinates.latitude,
      coordinates.longitude,
    );

    return ReportModel.getByLocal(address, geohash);
  }

  // AÇÕES DE CREATE
  async create() {
    const report = this.reportFormated;

    return await ReportModel.create(report);
  }

  async uploadFile(report_id) {
    // Processa a imagem com Sharp (redimensiona e comprime)
    const imageBuffer = await sharp(this.file.image.buffer)
      .resize(200) // Redimensiona para 200px
      .jpeg({ quality: 1 }) // Comprime para JPEG qualidade 1
      .toBuffer();

    const putData = {
      Bucket: process.env.S3_BUCKET,
      Key: `${report_id}/${this.file.key}`,
      StorageClass: "STANDARD",
      Body: imageBuffer,
      ContentType: "image/jpeg",
    };

    return ReportModel.uploadFile(putData);
  }

  async uploadFileToResolved(report_id) {
    const imageBuffer = await sharp(this.file.image.buffer)
      .resize(600) // Redimensiona para 200px
      .jpeg({ quality: 100 }) // Comprime para JPEG qualidade 1
      .toBuffer();

    const putData = {
      Bucket: process.env.S3_BUCKET_RESOLVED,
      Key: `${report_id}/${this.file.key}`,
      StorageClass: "STANDARD",
      Body: imageBuffer,
      ContentType: "image/jpeg",
    };

    return ReportModel.uploadFile(putData);
  }

  // AÇÕES DE UPDATE
  async addChildren() {
    const { reportFormated: report, childrenFormated: children } = this;
    const { falseId, address, geohash } = report;

    const newChildren = await ReportModel.addChildren(children, report);

    const report_id = {
      falseId,
      id: newChildren.Attributes.id,
      address,
      geohash,
    };

    return report_id;
  }

  async updateStatus() {
    const { address, geohash } = this.update;

    await ReportModel.updateStatus({ address, geohash, status: 1 });

    // Resposta final
    const report = { address, geohash, status: 1 };

    return report;
  }

  async repaired() {
    const { address, geohash } = this.formDataToReport();

    const report = await this.verifyReportExist(address, geohash);

    await this.uploadFileToResolved(report.id);

    const resolvedReport = {
      ...report,
      status: 2,
      expiration_timestamp: Math.floor(
        new Date().setFullYear(new Date().getFullYear() + 4) / 1000,
      ),
    };

    const user_emails = ChildrenInReport.getAllEmailsInReport(report);

    await UserModel.addServiceCounter(user_emails);
    await ResolvedReportModel.create(resolvedReport);
    await ReportModel.delete(address, geohash);

    // Resposta final
    const response = { address, geohash, status: 2 };

    return response;
  }

  // AÇÕES DE DELETE
  async deleteFilesByPrefix(prefix) {
    const paramsToGet = {
      Bucket: process.env.S3_BUCKET,
      Prefix: prefix,
    };

    const { Contents } = await ReportModel.getFilesByPrefix(paramsToGet);

    const paramsToDelete = {
      Bucket: process.env.S3_BUCKET,
      Delete: {
        Objects: Contents.map(({ Key }) => ({ Key })),
      },
    };

    return ReportModel.deleteFiles(paramsToDelete);
  }

  // PROCESSOS
  async processCreate() {
    this.reportFormated = this.formDataToReport();
    this.childrenFormated = this.formDataToChildren();

    const report = await this.getByLocal();

    if (!report) {
      const newReport = await this.create();
      await this.uploadFile(newReport.id);
      await UserModel.addReport(this.user_email, newReport.id);
      return this.addChildren();
    }

    if (report.childrens.length < 10) {
      const user = await UserModel.getByEmail(this.user_email);

      if (user.reports_id.length < 100) {
        await this.uploadFile(report.id);
      }
    }

    await UserModel.addReport(this.user_email, report.id);
    return this.addChildren();
  }

  async processDelete() {
    const { address, geohash } = this.local;

    const report = await this.verifyReportExist(address, geohash);

    const index = await this.verifyChildrenExist(this.user_email, report);

    const reponse = { id: report.id, address, geohash };

    if (report.childrens.length === 1) {
      await this.deleteFilesByPrefix(report.id);
      ReportModel.delete(address, geohash);

      return reponse;
    }

    ReportModel.removeChildren(index, address, geohash);

    return reponse;
  }

  // UTILS DA CLASSE
  async verifyReportExist(address, geohash) {
    const report = await ReportModel.getByLocal(address, geohash);

    if (!report) {
      throw new AppError(
        404, // Código de status apropriado para recursos não encontrados
        "Report not found",
        "Address and geohash were not found in the database.",
      );
    }

    return report;
  }

  async verifyChildrenExist(user_email, report) {
    const index = ChildrenInReport.getIndex(user_email, report);

    if (index === -1) {
      throw new AppError(
        404, // Código de status apropriado para recursos não encontrados
        "Children not found",
        "Children was not found within the report.",
      );
    }

    return index;
  }
}
