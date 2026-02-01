// IMPORTANDO SERVICES - Usando serviço local para demonstração (sem AWS)
import LocalReportService from "../../services/LocalReportService.js";

class ResolvedController {
  async get(req, res) {
    const reports = await LocalReportService.getResolved();

    res.status(200).json({ message: "Status retrieved successfully", reports });
  }

  async getResolved(req, res) {
    const { id, created_at } = req.params;

    const report = await LocalReportService.getResolvedByKeys(id, created_at);

    res.status(200).json({
      message: "Status retrieved successfully",
      data: report,
    });
  }

  async getRegistration(req, res) {
    // Retorna URLs de placeholder
    res.status(200).json({
      message: "Status retrieved successfully",
      urls: ["https://via.placeholder.com/400x300?text=Report+Registration"],
    });
  }
}

export default new ResolvedController();
