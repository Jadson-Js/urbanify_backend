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
  constructor(data = {}) {
    this.user_email = data.user_email;
    this.local = data.local;
    this.file = this.setFile(data);
    this.form = this.setForm(data);
    (this.reportFormated = {}), (this.childrenFormated = {});
  }

  setFile(data) {
    if (data.file) {
      const file = {
        image: data.file,
        key: `${new Date().toISOString()}-${data.file.originalname}`,
      };

      return file;
    } else {
      return undefined;
    }
  }

  setForm(data) {
    if (data.form) {
      let form = data.form;
      form.address = `${data.form.subregion}_${data.form.district}`;

      return form;
    } else {
      return undefined;
    }
  }

  async get() {
    const reports = await ReportModel.get();

    const reportsFormated = reports.map((report) => {
      const childrens = report.childrens;

      const childrenFormated = childrens.map((children) => {
        const { severity, created_at } = children;

        return {
          severity,
          created_at,
        };
      });

      return {
        ...report,
        childrens: childrenFormated,
      };
    });

    return reportsFormated;
  }

  async getReport() {
    const { address, geohash } = this.local;

    const report = await ReportModel.getByLocal(address, geohash);

    if (!report) {
      throw new AppError(
        404,
        "Report não encontrado",
        "Address e geohash não foram encontrado no banco de dados"
      );
    }

    return report;
  }

  async getMyReports() {
    const user = await UserModel.getByEmail(this.user_email);
    const reportList = user.reports_id.map((item) => item);
    const reports = await ReportModel.getByListId(reportList);

    const childrens = getChildrenInReport(this.user_email, reports);

    return childrens;
  }

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
      return await this.addChildren();

      // Se existir um report na região
    } else {
      // Verifica esse usuario ja fez report no mesmo local
      // const userExist = await this.verifyUserExist(report.id);

      // if (userExist) {
      //   throw new AppError(
      //     401,
      //     "Usuario ja reportou anteriormente",
      //     "O usuario não pode reportar o mesmo local mais de 1 vez"
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
      return await this.addChildren();
    }
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
      created_at: new Date().toISOString(),
      subregion,
      district,
      address,
      street,
      geohash: generateGeohash(coordinates.latitude, coordinates.longitude),
      coordinates: {
        latitude: coordinates.latitude,
        longitude: coordinates.longitude,
      },
      childrens: [],
    };

    return putData;
  }

  formDataToChildren() {
    const { severity, coordinates } = this.form;

    const putData = {
      user_email: this.user_email,
      // Talvez no futuro, vc precise adicionar o prefixo (id do report)
      s3_photo_key: this.file.key,
      severity: ReportSeverity[severity],
      created_at: new Date().toISOString(),
      coordinates: {
        latitude: coordinates.latitude,
        longitude: coordinates.longitude,
      },
    };

    return putData;
  }

  async getByLocal() {
    const { address, coordinates } = this.form;

    const geohash = generateGeohash(
      coordinates.latitude,
      coordinates.longitude
    );

    return ReportModel.getByLocal(address, geohash);
  }

  async getStatusByLocal() {
    const { address, geohash } = this.local;

    const report = await ReportModel.getByLocal(address, geohash);

    const alreadyExist = userExist(this.user_email, report);

    if (report) {
      if (!alreadyExist) {
        throw new AppError(
          401,
          "Usuario não autorizado",
          "O usuario não tem autorização para acessar os dados de um report que não faça parte"
        );
      }

      return report.status;
    } else {
      throw new AppError(
        404,
        "Report não encontrado",
        "Address e geohash não foram encontrado no banco de dados"
      );
    }
  }

  async verifyUserExist(report_id) {
    const user = await UserModel.getByEmail(this.user_email);

    return userExist(user, report_id);
  }

  async uploadFile(report_id) {
    // Processa a imagem com Sharp (redimensiona e comprime)
    const image = sharp(this.file.image.buffer)
      .resize(800) // Redimensiona para 800px
      .jpeg({ quality: 10 }) // Comprime para JPEG qualidade 80
      .toString("base64");

    const putData = {
      Bucket: process.env.S3_BUCKET,
      Key: `${report_id}/${this.file.key}`,
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

    const report_id = {
      id: newChildren.Attributes.id,
      address: report.address,
      geohash: report.geohash,
    };

    return report_id;
  }

  async processDelete() {
    const user_email = this.user_email;
    const { address, geohash } = this.local;

    const report = await ReportModel.getByLocal(address, geohash);

    if (!report) {
      throw new AppError(
        404,
        "Report não encontrado",
        "Address e geohash não foram encontrado no banco de dados"
      );
    }

    const index = getIndexChildren(user_email, report);

    const childrensLength = report.childrens.length;

    if (childrensLength == 1 && index != -1) {
      await this.deleteFilesByPrefix(report.id);
      return await ReportModel.delete(address, geohash);
    } else if (index != -1) {
      return await ReportModel.removeChildren(index, address, geohash);
    } else {
      throw new AppError(
        404,
        "Children não encontrado",
        "Children não foi encontrado dentro do report"
      );
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
