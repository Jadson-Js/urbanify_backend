import ReportService from "../../services/ReportService.js";
import { compress } from "../../utils/compress.js";

class ReportController {
  async create(req, res) {
    const data = {
      user_id: req.user_id.S,
      report: JSON.parse(req.body.data),
      pathFile: await compress(),
    };

    try {
      const reportService = new ReportService(data);

      const putReport = reportService.processCreate();

      res.status(201).json({
        message: "Report cadastrado com sucesso!",
        report: putReport,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Erro ao cadastrar report.", error });
    }
  }

  async delete(req, res) {
    const user_id = req.user_id;
    const data = req.body;

    try {
      const reportService = new ReportService();

      const deleteReport = reportService.processDelete(user_id, data);

      res.status(201).json({
        message: "Report deletado com sucesso!",
        report: deleteReport,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Erro ao deletar report.", error });
    }
  }
}

export default new ReportController();
