import ReportService from "../../services/ReportService.js";

class ReportController {
  async get(req, res) {
    const reportService = new ReportService();

    const reports = await reportService.get();

    res.status(200).json({ message: "Busca concluida!", reports });
  }

  async getMyReports(req, res) {
    const data = {
      user_email: req.user_email,
    };

    const reportService = new ReportService(data);

    const reports = await reportService.getMyReports();

    res.status(200).json({
      message: "Busca feita com sucesso!",
      report: reports,
    });
  }

  async getReport(req, res) {
    const { address, geohash } = req.params;

    const data = {
      local: { address: address, geohash: geohash },
    };

    const reportService = new ReportService(data);

    const response = await reportService.getReport();

    res.status(200).json({
      message: "Busca feita com sucesso!",
      data: response,
    });
  }

  async getStatus(req, res) {
    const { address, geohash } = req.params;

    const data = {
      user_email: req.user_email,
      local: { address: address, geohash: geohash },
    };

    const reportService = new ReportService(data);

    const status = await reportService.getStatus();

    res.status(200).json({
      message: "Busca feita com sucesso!",
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
      message: "Report cadastrado com sucesso!",
      report: putReport,
    });
  }

  async updateStatus(req, res) {
    const { status } = req.body;
    const { address, geohash } = req.params;

    const data = {
      update: { status: status, address, geohash },
    };

    const reportService = new ReportService(data);
    const response = await reportService.updateStatus();

    res.status(200).json({
      message: "Edição feita com sucesso!",
      report: response,
    });
  }

  async delete(req, res) {
    const data = {
      user_email: req.user_email,
      local: req.body,
    };

    const reportService = new ReportService(data);

    const deleteReport = await reportService.processDelete();

    res.status(201).json({
      message: "Report deletado com sucesso!",
      report: deleteReport,
    });
  }
}

export default new ReportController();
