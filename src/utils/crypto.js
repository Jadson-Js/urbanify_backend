import crypto from "crypto";
import dotenv from "dotenv";
dotenv.config();

const algorithm = "aes-256-ctr";
const secretKey = crypto
  .createHash("sha256")
  .update(process.env.CRYPTO_UPDATE)
  .digest("base64")
  .slice(0, 32);

export function encrypt(text) {
  if (!text || typeof text !== "string") {
    throw new TypeError(
      'O argumento "text" deve ser do tipo string e não pode ser indefinido.'
    );
  }

  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, secretKey, iv);
  const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);

  return `${iv.toString("hex")}_${encrypted.toString("hex")}`;
}

export function decrypt(hash) {
  if (!hash || typeof hash !== "string") {
    throw new TypeError(
      'O argumento "hash" deve ser do tipo string e não pode ser indefinido.'
    );
  }

  const [ivHex, contentHex] = hash.split("_");
  const iv = Buffer.from(ivHex, "hex");
  const content = Buffer.from(contentHex, "hex");
  const decipher = crypto.createDecipheriv(algorithm, secretKey, iv);
  const decrypted = Buffer.concat([decipher.update(content), decipher.final()]);

  return decrypted.toString();
}
