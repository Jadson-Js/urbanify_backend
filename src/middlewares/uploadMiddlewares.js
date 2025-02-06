// habilita as rotas possibilidade de receber arquivos
import multer from "multer";

const maxFileSize = 3 * 1024 * 1024; // 5MB

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

const filter = (req, file, cb) => {
  const filetypes = /jpeg|jpg|png/;
  const mimetype = filetypes.test(file.mimetype);
  const extname = filetypes.test(file.originalname.toLowerCase());

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error("Only .jpeg, .jpg and .png files are allowed!"));
  }
};

const upload = multer({
  storage,
  limits: { fileSize: maxFileSize },
  // fileFilter: filter,
  // Limita o tamanho do arquivo
}); // Aqui você especifica o campo do formulário para o arquivo

export default upload;
