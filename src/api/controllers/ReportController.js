// Importando os serviços
import ReportService from "../../services/ReportServiceTest.js";
import { compress } from "../../utils/compress.js";

// Informa ao service o req.body, com a finalidade de salvar o usuario ao banco de dados

class ReportController {
  async create(req, res) {
    const data = {
      report: JSON.parse(req.body.data),
      pathFile: await compress(),
    };

    try {
      const putReport = await ReportService.processReport(data);

      res.status(201).json({
        message: "Report cadastrado com sucesso!",
        report: putReport,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Erro ao cadastrar report.", error });
    }
  }
}

export default new ReportController();
