// Import Models
import ResolvedReportModel from "../models/ResolvedReportModel.js";
import UserModel from "../models/UserModel.js";

// Report Utils
import { generateGeohash } from "../utils/geohash.js";
import { userExist } from "../utils/userExist.js";
import { getChildrenInReport } from "../utils/getChildrenInReport.js";
import AppError from "../utils/AppError.js";

export default class ReportService {
  // Setup Inicial
  constructor(data = {}) {
    this.user_email = data.user_email;
    this.local = data.local;
  }

  // Rotas para Buscas
  async get() {
    const reports = await ResolvedReportModel.get();

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
    const report = await ResolvedReportModel.getByLocal(address, geohash);

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

    const reports = await ResolvedReportModel.getByListId(reportList);
    const childrens = getChildrenInReport(this.user_email, reports);

    return childrens;
  }

  async getStatus() {
    const { address, geohash } = this.local;
    const report = await ResolvedReportModel.getByLocal(address, geohash);

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

  // Utilitarios da classes
  async generatePresignedUrl(prefix) {
    const paramsToGet = {
      Bucket: process.env.S3_BUCKET,
      Prefix: prefix,
    };

    const { Contents } = await ResolvedReportModel.getFilesByPrefix(
      paramsToGet
    );
    const urls = await ResolvedReportModel.generatePresignedUrl(Contents);

    return urls;
  }

  async getByLocal() {
    const { address, coordinates } = this.form;

    const geohash = generateGeohash(
      coordinates.latitude,
      coordinates.longitude
    );

    return ResolvedReportModel.getByLocal(address, geohash);
  }
}
