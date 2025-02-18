import LogService from "../../services/LogService.js";

class LogController {
  async get(req, res) {
    const logs = await LogService.get();

    res.status(200).json({ message: "Busca concluida!", logs });
  }

  async create(req, res) {
    const data = req.body;

    const log = await LogService.create(data);

    res.status(201).json({ message: "Log criado com sucesso!", log });
  }
}

export default new LogController();
