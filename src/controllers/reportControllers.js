// Importando os serviços
import { saveFileToUpload, saveReport } from "../services/reportServices.js";

// Informa ao service o req.body, com a finalidade de salvar o usuario ao banco de dados
export const createReport = async (req, res) => {
  const data = JSON.parse(req.body.data);

  if (!req.file) {
    return res.status(400).send("Nenhum arquivo foi enviado. ");
  }

  // Defini o caminho e nome
  const filePath = req.file.path;
  const fileName = req.file.filename;

  try {
    // Invoca service que tratar os parametros para inserir no S3
    await saveFileToUpload(filePath, fileName);

    // Invoca service que tratar o conteudo para inserir no Dynamo
    const report = await saveReport(data, fileName);

    res.status(201).json({ message: "Report criado com sucesso!", report });
  } catch (error) {
    res.status(500).json({ message: "Erro ao criar report.", error });
  }
};
