import fs from "fs/promises";
import path from "path";

// Importando os serviços
import {
  saveFileToUpload,
  saveReport,
  saveChildrenReport,
  findReportByGeo,
} from "../services/reportServices.js";
import { compress } from "../utils/compress.js";

// Informa ao service o req.body, com a finalidade de salvar o usuario ao banco de dados
export const createReport = async (req, res) => {
  const data = {
    report: JSON.parse(req.body.data),
    pathFile: await compress(),
  };

  try {
    const report = await findReportByGeo(
      data.report.district,
      data.report.coordinates.latitude,
      data.report.coordinates.longitude
    );

    await saveFileToUpload(data);

    if (report) {
      const putReport = await saveChildrenReport(data, report);

      res
        .status(201)
        .json({ message: "Report atualizado com sucesso! " + putReport });
    } else {
      const putReport = await saveReport(data);

      res
        .status(201)
        .json({ message: "Report cadastrado com sucesso! " + putReport });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Erro ao cadastrar report.", error });
  }
};
