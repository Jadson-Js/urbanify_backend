// Importando os serviços
import { findLogs, saveLog } from "../../services/logServices.js";

// Informa ao service o req.body, com a finalidade de salvar o usuario ao banco de dados
export const getLogs = async (req, res) => {
  try {
    // Invoca service que tratar os parametros para inserir no S3
    const logs = await findLogs();

    res.status(201).json({ message: "Busca concluida!", logs });
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar histórico.", error });
  }
};

export const postLog = async (req, res) => {
  const data = req.body;

  try {
    // Invoca service que tratar o conteudo para inserir no Dynamo
    const log = await saveLog(data);

    res.status(201).json({ message: "Log criado com sucesso!", log });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Erro ao criar log.", error });
  }
};
