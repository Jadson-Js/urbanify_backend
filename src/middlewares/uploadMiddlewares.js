// habilita as rotas possibilidade de receber arquivos
import multer from "multer";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Poem o arquivo na pasta download
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    // é definido o nome do arquivo
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

export default upload;
