// Import Models
import ResolvedModel from "../models/ResolvedModel.js";
import UserModel from "../models/UserModel.js";

// Report Utils
import { generateGeohash } from "../utils/geohash.js";
import { userExist } from "../utils/userExist.js";
import { getChildrenInReport } from "../utils/getChildrenInReport.js";
import AppError from "../utils/AppError.js";
import { PassThrough } from "stream";

export default class ResolvedService {
  // Setup Inicial
  constructor(data = {}) {
    this.user_email = data.user_email;
    this.keys = data.keys;
  }

  // Rotas para Buscas
  async get() {
    const reports = await ResolvedModel.get();

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
    const report = await ResolvedModel.getByKeys(this.keys);

    if (!report) {
      throw new AppError(
        404,
        "Report não encontrado",
        "id e created_at não foram encontrados no banco de dados"
      );
    }

    const urls = await this.generatePresignedUrl(report.id);

    return { report, urls };
  }

  // Utilitarios da classes
  async generatePresignedUrl(prefix) {
    const paramsToGet = {
      Bucket: process.env.S3_BUCKET,
      Prefix: prefix,
    };

    const { Contents } = await ResolvedModel.getFilesByPrefix(paramsToGet);
    const urls = await ResolvedModel.generatePresignedUrl(Contents);

    return urls;
  }
}
