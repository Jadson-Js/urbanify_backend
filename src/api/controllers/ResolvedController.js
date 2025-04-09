// IMPORTANDO SERVICES
import ResolvedService from "../../services/ResolvedService.js";

class ResolvedController {
  async get(req, res) {
    const resolvedService = new ResolvedService();

    const reports = await resolvedService.get();

    res.status(200).json({ message: "Status retrieved successfully", reports });
  }

  async getResolved(req, res) {
    const { id, created_at } = req.params;

    const data = {
      keys: { id, created_at },
    };

    const resolvedService = new ResolvedService(data);

    const report = await resolvedService.getReport();

    res.status(200).json({
      message: "Status retrieved successfully",
      data: report,
    });
  }

  async getRegistration(req, res) {
    const { id, created_at } = req.params;

    const data = {
      keys: { id, created_at },
    };

    const resolvedService = new ResolvedService(data);

    const urls = await resolvedService.getRegistration();

    res.status(200).json({
      message: "Status retrieved successfully",
      urls,
    });
  }
}

export default new ResolvedController();
