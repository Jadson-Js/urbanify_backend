// Importando os serviços
import { findHistory, saveHistory } from "../services/historyServices.js";

// Informa ao service o req.body, com a finalidade de salvar o usuario ao banco de dados
export const getHistorical = async (req, res) => {
  try {
    // Invoca service que tratar os parametros para inserir no S3
    const historical = await findHistory();

    res.status(201).json({ message: "Busca concluida!", historical });
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar histórico.", error });
  }
};

export const postHistory = async (req, res) => {
  const data = req.body;

  try {
    // Invoca service que tratar o conteudo para inserir no Dynamo
    const history = await saveHistory(data);

    res.status(201).json({ message: "Historico criado com sucesso!", history });
  } catch (error) {
    res.status(500).json({ message: "Erro ao criar history.", error });
  }
};
