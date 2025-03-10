// IMPORTANDO SERVICES
import ReportService from "../../services/ReportService.js";

class ReportController {
  async get(req, res) {
    const reportService = new ReportService();

    const reports = await reportService.get();

    res
      .status(200)
      .json({ message: "Reports retrieved successfully", reports });
  }

  async getMyReports(req, res) {
    const data = {
      user_email: req.user_email,
    };

    const reportService = new ReportService(data);

    const reports = await reportService.getMyReports();

    res.status(200).json({
      message: "Reports retrieved successfully",
      reports,
    });
  }

  async getReport(req, res) {
    const { address, geohash } = req.params;

    const data = {
      local: { address, geohash },
    };

    const reportService = new ReportService(data);

    const response = await reportService.getReport();

    res.status(200).json({
      message: "Report retrieved successfully",
      data: response,
    });
  }

  async getStatus(req, res) {
    const { address, geohash } = req.params;

    const data = {
      user_email: req.user_email,
      local: { address, geohash },
    };

    const reportService = new ReportService(data);

    const status = await reportService.getStatus();

    res.status(200).json({
      message: "Status retrieved successfully",
      status: status,
    });
  }

  async create(req, res) {
    const data = {
      user_email: req.user_email,
      form: JSON.parse(req.body.data),
      file: req.file,
    };

    const reportService = new ReportService(data);

    const putReport = await reportService.processCreate();

    res.status(201).json({
      message: "Report created successfully",
      report: putReport,
    });
  }

  async updateStatus(req, res) {
    const { status } = req.body;
    const { address, geohash } = req.params;

    const data = {
      update: { status, address, geohash },
    };

    const reportService = new ReportService(data);
    const report = await reportService.updateStatus();

    res.status(200).json({
      message: "Report status updated successfully",
      report,
    });
  }

  async delete(req, res) {
    const { address, geohash } = req.params;

    const data = {
      user_email: req.user_email,
      local: { address, geohash },
    };

    const reportService = new ReportService(data);

    await reportService.processDelete();

    res.status(204).send();
  }
}

export default new ReportController();
