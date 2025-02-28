import ResolvedReportService from "../../services/ResolvedReportService.js";

class ReportController {
  async get(req, res) {
    const resolvedReportService = new ResolvedReportService();

    const reports = await resolvedReportService.get();

    res.status(200).json({ message: "Busca concluida!", reports });
  }

  async getMyReports(req, res) {
    const data = {
      user_email: req.user_email,
    };

    const resolvedReportService = new ResolvedReportService(data);

    const reports = await resolvedReportService.getMyReports();

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

    const resolvedReportService = new ResolvedReportService(data);

    const response = await resolvedReportService.getReport();

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

    const resolvedReportService = new ResolvedReportService(data);

    const status = await resolvedReportService.getStatus();

    res.status(200).json({
      message: "Busca feita com sucesso!",
      status: status,
    });
  }
}

export default new ReportController();
