import fs from "fs/promises";
import path from "path";

// Importando os serviços
import { saveFileToUpload, saveReport } from "../services/reportServices.js";
import { compress } from "../utils/compress.js";

// Informa ao service o req.body, com a finalidade de salvar o usuario ao banco de dados
export const createReport = async (req, res) => {
  // const filePath = path.join("compress", compress());

  const data = {
    report: JSON.parse(req.body.data),
    pathFile: await compress(),
  };

  try {
    // Invoca service que tratar os parametros para inserir no S3
    await saveFileToUpload(data);

    // Invoca service que tratar o conteudo para inserir no Dynamo
    const report = await saveReport(data);

    res.status(201).json({ message: "Report criado com sucesso!", report });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Erro ao criar report.", error });
  }
};
