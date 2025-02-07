import fs from "fs/promises";
import path from "path";

// Importando os serviços
import {
  saveFileToUpload,
  saveReport,
  saveChildrenReport,
} from "../services/reportServices.js";
import { compress } from "../utils/compress.js";

// Informa ao service o req.body, com a finalidade de salvar o usuario ao banco de dados
export const createReport = async (req, res) => {
  const data = {
    report: JSON.parse(req.body.data),
    pathFile: await compress(),
  };

  try {
    // Invoca service que tratar os parametros para inserir no S3
    await saveFileToUpload(data);

    // Invoca service que tratar o conteudo para inserir no Dynamo
    // const report = await saveReport(data);
    const report = await saveChildrenReport(data);

    res.status(201).json({ message: "Report atualizado com sucesso!", report });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Erro ao atualizar report.", error });
  }
};
