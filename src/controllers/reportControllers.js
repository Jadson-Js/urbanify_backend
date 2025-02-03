// Importando os serviços
import { saveReport } from "../services/reportServices.js";

// Informa ao service o req.body, com a finalidade de salvar o usuario ao banco de dados
export const createReport = async (req, res) => {
  try {
    const report = await saveReport(req.body);

    res.status(201).json({ message: "Report criado com sucesso!", report });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Erro ao criar report.", error });
  }
};
