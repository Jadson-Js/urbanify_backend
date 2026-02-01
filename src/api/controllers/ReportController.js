// IMPORTANDO SERVICES - Usando serviço local para demonstração (sem AWS)
import LocalReportService from "../../services/LocalReportService.js";

class ReportController {
  async get(req, res) {
    const reports = await LocalReportService.getAll();

    res
      .status(200)
      .json({ message: "Reports retrieved successfully", reports });
  }

  async getEvaluated(req, res) {
    const reports = await LocalReportService.getEvaluated();

    res
      .status(200)
      .json({ message: "Reports retrieved successfully", reports });
  }

  async getMyReports(req, res) {
    // Retorna alguns reports mockados como se fossem do usuário
    const reports = await LocalReportService.getAll();
    const myReports = reports.slice(0, 2); // Primeiros 2 reports

    res.status(200).json({
      message: "Reports retrieved successfully",
      reports: myReports,
    });
  }

  async getReport(req, res) {
    const { address, geohash } = req.params;

    const response = await LocalReportService.getByLocal(address, geohash);

    res.status(200).json({
      message: "Report retrieved successfully",
      data: response,
    });
  }

  async getStatus(req, res) {
    // Retorna status mockado
    res.status(200).json({
      message: "Status retrieved successfully",
      status: 1,
    });
  }

  async create(req, res) {
    // Simula criação de report
    console.log("[LOCAL] Simulando criação de report");

    res.status(201).json({
      message: "Report created successfully (demo mode)",
      report: {
        id: `demo-${Date.now()}`,
        address: "Demo_Address",
        geohash: "demo123",
      },
    });
  }

  async updateStatus(req, res) {
    const { address, geohash } = req.params;

    res.status(200).json({
      message: "Report status updated successfully (demo mode)",
      report: {
        address,
        geohash,
        status: 1,
      },
    });
  }

  async repaired(req, res) {
    console.log("[LOCAL] Simulando report como reparado");

    res.status(200).json({
      message: "Report status updated successfully (demo mode)",
      report: {
        address: "Demo_Address",
        geohash: "demo123",
        status: 2,
      },
    });
  }

  async delete(req, res) {
    console.log("[LOCAL] Simulando exclusão de report");
    res.status(204).send();
  }
}

export default new ReportController();
