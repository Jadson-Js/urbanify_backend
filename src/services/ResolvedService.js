// IMPORTANDO UTILS
import AppError from "../utils/AppError.js";

// IMPORTANDO MODELS
import ResolvedModel from "../models/ResolvedModel.js";

export default class ResolvedService {
  // CONSTRUTOR DA CLASSES
  constructor(data = {}) {
    this.user_email = data.user_email;
    this.keys = data.keys;
  }

  // AÇÕES DE GET
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
        404, // Código de status apropriado para recursos não encontrados
        "Report not found",
        "id and created_at were not found in the database."
      );
    }

    const urls = await this.generatePresignedUrl(report.id);

    return { report, urls };
  }

  async getRegistration() {
    const report = await ResolvedModel.getByKeys(this.keys);

    if (!report) {
      throw new AppError(
        404, // Código de status apropriado para recursos não encontrados
        "Report not found",
        "id and created_at were not found in the database."
      );
    }

    const urls = await this.generatePresignedUrl(report.id);

    return urls;
  }

  async generatePresignedUrl(prefix) {
    const paramsToGet = {
      Bucket: process.env.S3_BUCKET_RESOLVED,
      Prefix: prefix,
    };

    const { Contents } = await ResolvedModel.getFilesByPrefix(paramsToGet);

    console.log(Contents);

    const urls = await ResolvedModel.getPresignedUrl(Contents);

    return urls;
  }
}
