// Import dependences
import crypto from "crypto";
import sharp from "sharp";

// Import Models
import ReportModel from "../models/ReportModel.js";
import UserModel from "../models/UserModel.js";

// Import config
import { ReportStatus, ReportSeverity } from "../config/environment.js";

// Report Utils
import { generateGeohash } from "../utils/geohash.js";
import { userExist } from "../utils/userExist.js";
import { getIndexChildren } from "../utils/getIndexChildren.js";
import { getChildrenInReport } from "../utils/getChildrenInReport.js";
import AppError from "../utils/AppError.js";

export default class ReportService {
  // Setup Inicial
  constructor(data = {}) {
    this.user_email = data.user_email;
    this.local = data.local;
    this.file = this.setFile(data);
    this.form = this.setForm(data);
    this.date = new Date().toISOString();
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

  // Rotas para Buscas
  async get() {
    const reports = await ReportModel.get();

    const reportsFormatted = reports.map((report) => {
      const childrenFormatted = report.childrens.map(
        ({ severity, created_at }) => ({
          severity,
          created_at,
        })
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
    const report = await ReportModel.getByLocal(address, geohash);

    if (!report) {
      throw new AppError(
        404,
        "Report não encontrado",
        "Address e geohash não foram encontrados no banco de dados"
      );
    }

    const urls = await this.generatePresignedUrl(report.id);

    return { report, urls };
  }

  async getMyReports() {
    const user = await UserModel.getByEmail(this.user_email);
    const reportList = user.reports_id;

    const reports = await ReportModel.getByListId(reportList);
    const childrens = getChildrenInReport(this.user_email, reports);

    return childrens;
  }

  async getStatus() {
    const { address, geohash } = this.local;
    const report = await ReportModel.getByLocal(address, geohash);

    if (!report) {
      throw new AppError(
        404,
        "Report não encontrado",
        "Address e geohash não foram encontrados no banco de dados"
      );
    }

    const alreadyExist = userExist(this.user_email, report);

    if (!alreadyExist) {
      throw new AppError(
        401,
        "Usuário não autorizado",
        "O usuário não tem autorização para acessar os dados de um report que não faça parte"
      );
    }

    return report.status;
  }

  // Rotas para criação
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

  // Utilitarios da classes
  async generatePresignedUrl(prefix) {
    const paramsToGet = {
      Bucket: process.env.S3_BUCKET,
      Prefix: prefix,
    };

    const { Contents } = await ReportModel.getFilesByPrefix(paramsToGet);
    const urls = await ReportModel.generatePresignedUrl(Contents);

    return urls;
  }

  async getByLocal() {
    const { address, coordinates } = this.form;

    const geohash = generateGeohash(
      coordinates.latitude,
      coordinates.longitude
    );

    return ReportModel.getByLocal(address, geohash);
  }

  async addChildren() {
    const { reportFormated: report, childrenFormated: children } = this;

    const newChildren = await ReportModel.addChildren(children, report);

    const report_id = {
      id: newChildren.Attributes.id,
      address: report.address,
      geohash: report.geohash,
    };

    return report_id;
  }

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

  // Processos

  async processCreate() {
    this.reportFormated = this.formDataToReport();
    this.childrenFormated = this.formDataToChildren();

    // Faz uma busca para saber se existe algum report existente no local requisitado
    const report = await this.getByLocal();

    // Se não existir nenhum report anterior
    if (!report) {
      const newReport = await this.create();

      // Enviar o arquivo para o S3
      await this.uploadFile(newReport.id);

      // Vai chamar um model onde vai informar os parametros email & report_id
      await UserModel.addReport(this.user_email, newReport.id);

      // adiciona o children ao report e retornar os dados
      return this.addChildren();
    }

    // Se existir um report na região
    // Verifica esse usuário já fez report no mesmo local
    // const userExist = "Use o util userExist"

    // if (userExist) {
    //   throw new AppError(
    //     401,
    //     "Usuário já reportou anteriormente",
    //     "O usuário não pode reportar o mesmo local mais de 1 vez"
    //   );
    // }

    const childrensLength = report.childrens.length;

    // Verifica se este report tem mais de 3 filhos
    if (childrensLength < 3) {
      // Se tiver, ele faz o upload da fotografia para o report
      await this.uploadFile(report.id);
    }

    await UserModel.addReport(this.user_email, report.id);
    // Adiciona-se o report como filho
    return this.addChildren();
  }

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

    if (report.childrens.length < 3) {
      await this.uploadFile(report.id);
    }

    await UserModel.addReport(this.user_email, report.id);
    return this.addChildren();
  }

  async processDelete() {
    const { address, geohash } = this.local;
    const report = await ReportModel.getByLocal(address, geohash);

    if (!report) {
      throw new AppError(
        404,
        "Report não encontrado",
        "Address e geohash não foram encontrados no banco de dados"
      );
    }

    const index = getIndexChildren(this.user_email, report);

    if (index === -1) {
      throw new AppError(
        404,
        "Children não encontrado",
        "Children não foi encontrado dentro do report"
      );
    }

    if (report.childrens.length === 1) {
      await this.deleteFilesByPrefix(report.id);
      return ReportModel.delete(address, geohash);
    }

    return ReportModel.removeChildren(index, address, geohash);
  }
}
