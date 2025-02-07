import sharp from "sharp";
import fs from "fs/promises";
import path from "path";

export const compress = async () => {
  const directory = "uploads/";
  const outputDir = "compress/";

  const [file] = await fs.readdir(directory); // Obtém apenas o primeiro arquivo

  if (!file || !/\.(jpe?g|png|gif)$/i.test(file)) return; // Verifica se é uma imagem válida

  const inputPath = path.join(directory, file);
  const outputPath = path.join(outputDir, file);

  const compressed = await sharp(inputPath)
    .resize(800, 800, { fit: "inside", withoutEnlargement: true })
    .jpeg({ progressive: true, quality: 10 })
    .toBuffer();

  await fs.writeFile(outputPath, compressed);
  return outputPath;
  // fs.unlink(inputPath);
};
