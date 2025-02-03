// Importando os serviços
import { saveFileToUpload, saveReport } from "../services/reportServices.js";

// Informa ao service o req.body, com a finalidade de salvar o usuario ao banco de dados
export const createReport = async (req, res) => {
  const data = JSON.parse(req.body.data);

  if (!req.file) {
    return res.status(400).send("Nenhum arquivo foi enviado. ");
  }
  const filePath = req.file.path;
  const fileName = req.file.filename;

  try {
    const file = await saveFileToUpload(filePath, fileName);
    data.photo_name = fileName;
    const report = await saveReport(data);

    console.log(file);
    console.log(
      "################################################################"
    );
    console.log(report);

    res.status(201).json({ message: "Report criado com sucesso!", report });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Erro ao criar report.", error });
  }
};
