// IMPORTANDO SERVICES
import ResolvedService from "../../services/ResolvedService.js";

class ResolvedController {
  async get(req, res) {
    const resolvedService = new ResolvedService();

    const reports = await resolvedService.get();

    res.status(200).json({ message: "Busca concluida!", reports });
  }

  async getResolved(req, res) {
    const { id, created_at } = req.params;

    const data = {
      keys: { id, created_at },
    };

    const resolvedService = new ResolvedService(data);

    const report = await resolvedService.getReport();

    res.status(200).json({
      message: "Busca feita com sucesso!",
      report,
    });
  }
}

export default new ResolvedController();
