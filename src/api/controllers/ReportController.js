import ReportService from "../../services/ReportService.js";

class ReportController {
  async get(req, res) {
    try {
      const reportService = new ReportService();

      const reports = await reportService.get();

      res.status(201).json({ message: "Busca concluida!", reports });
    } catch (error) {
      res.status(500).json({ message: "Erro ao buscar reports.", error });
    }
  }

  async getStatus(req, res) {
    const data = {
      body: req.body,
    };

    try {
      const reportService = new ReportService(data);

      const status = await reportService.getStatusByLocal();

      res.status(201).json({
        message: "Busca feita com sucesso!",
        status: status,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Erro ao buscar reports.", error });
    }
  }

  async getMyReports(req, res) {
    const data = {
      user_email: req.user_email,
    };

    try {
      const reportService = new ReportService(data);

      const reports = await reportService.getMyReports();

      res.status(201).json({
        message: "Busca feita com sucesso!",
        report: reports,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Erro ao buscar reports.", error });
    }
  }

  async create(req, res) {
    const data = {
      user_email: req.user_email,
      report: JSON.parse(req.body.data),
      file: req.file,
    };

    try {
      const reportService = new ReportService(data);

      const putReport = await reportService.processCreate();

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
    const data = {
      user_email: req.user_email,
      body: req.body,
    };

    try {
      const reportService = new ReportService(data);

      const deleteReport = await reportService.processDelete();
      console.log(deleteReport);

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
