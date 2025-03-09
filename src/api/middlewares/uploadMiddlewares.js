import multer from "multer";

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Apenas arquivos de imagem (JPEG, PNG, GIF, WEBP) são permitidos!"
      ),
      false
    );
  }
};

const limits = { fileSize: 5 * 1024 * 1024 }; // 5MB

const upload = multer({ storage, fileFilter, limits });

export default upload;
