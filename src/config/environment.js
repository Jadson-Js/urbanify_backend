// IMPORTANDO DEPENDENCIAS
import dotenv from "dotenv";

// SETUP
dotenv.config();

export const rateLimitConfig = {
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // Máximo de 100 requisições por IP
  message: "Too many requests, please try again later.",
  headers: true,
};

export const dynamoConfig = {
  region: process.env.AWS_REGION,
  endpoint: process.env.DYNAMODB_ENDPOINT,
  credentials: {
    accessKeyId: process.env.AWS_ACCESSKEYID,
    secretAccessKey: process.env.AWS_SECRETACCESSKEY,
  },
};

export const s3Config = {
  region: process.env.AWS_REGION, // Substitua pela sua região
  credentials: {
    accessKeyId: process.env.AWS_ACCESSKEYID,
    secretAccessKey: process.env.AWS_SECRETACCESSKEY,
  },
};

export const sesConfig = {
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESSKEYID,
    secretAccessKey: process.env.AWS_SECRETACCESSKEY,
  },
};
export const sesSource = process.env.SES_EMAIL_SOURCE;

export const snsConfig = {
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESSKEYID,
    secretAccessKey: process.env.AWS_SECRETACCESSKEY,
  },
};
export const snsARN = process.env.SNS_ARN;

export const ReportStatus = Object.freeze({
  REPORTADO: 0,
  AVALIADO: 1,
  CONCLUIDO: 2,
});

export const ReportSeverity = Object.freeze({
  GRAVE: 0,
  MODERADO: 1,
});

export const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
