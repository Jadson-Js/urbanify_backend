import LogService from "../../services/LogService.js";

class LogController {
  async get(req, res) {
    try {
      const logs = await LogService.get();

      res.status(201).json({ message: "Busca concluida!", logs });
    } catch (error) {
      res.status(500).json({ message: "Erro ao buscar histórico.", error });
    }
  }

  async create(req, res) {
    const data = req.body;

    try {
      const log = await LogService.create(data);

      res.status(201).json({ message: "Log criado com sucesso!", log });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Erro ao criar log.", error });
    }
  }
}

export default new LogController();
