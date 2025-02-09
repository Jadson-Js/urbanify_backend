// Importando os serviços
import ReportService from "../../services/ReportService.js";
import { compress } from "../../utils/compress.js";

// Informa ao service o req.body, com a finalidade de salvar o usuario ao banco de dados

class ReportController {
  async create(req, res) {
    const data = {
      report: JSON.parse(req.body.data),
      pathFile: await compress(),
    };

    try {
      const report = await ReportService.getByLocal(
        data.report.district,
        data.report.coordinates.latitude,
        data.report.coordinates.longitude
      );

      await ReportService.uploadFile(data);

      if (!report) {
        const putReport = await ReportService.create(data);

        res.status(201).json({
          message: "Report cadastrado com sucesso!",
          report: putReport,
        });
      } else {
        const putReport = await ReportService.update(data, report);

        res.status(201).json({
          message: "Report atualizado com sucesso!",
          report: putReport,
        });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Erro ao cadastrar report.", error });
    }
  }
}

export default new ReportController();
