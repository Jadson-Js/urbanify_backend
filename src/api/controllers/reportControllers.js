// Importando os serviços
import {
  getReportService,
  createFileService,
  createReportService,
  createChildrenService,
} from "../../services/reportServices.js";
import { compress } from "../../utils/compress.js";

// Informa ao service o req.body, com a finalidade de salvar o usuario ao banco de dados
export const createReport = async (req, res) => {
  const data = {
    report: JSON.parse(req.body.data),
    pathFile: await compress(),
  };

  try {
    const report = await getReportService(
      data.report.district,
      data.report.coordinates.latitude,
      data.report.coordinates.longitude
    );

    await createFileService(data);

    if (!report) {
      const putReport = await createReportService(data);

      res
        .status(201)
        .json({ message: "Report cadastrado com sucesso!", report: putReport });
    } else {
      const putReport = await createChildrenService(data, report);

      res
        .status(201)
        .json({ message: "Report atualizado com sucesso!", report: putReport });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Erro ao cadastrar report.", error });
  }
};
