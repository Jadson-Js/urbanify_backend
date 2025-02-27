import dotenv from "dotenv";
dotenv.config();

const dynamoConfig = {
  region: process.env.AWS_REGION,
  endpoint: process.env.DYNAMODB_ENDPOINT,
  credentials: {
    accessKeyId: process.env.AWS_ACCESSKEYID,
    secretAccessKey: process.env.AWS_SECRETACCESSKEY,
  },
};

const s3Config = {
  region: process.env.AWS_REGION, // Substitua pela sua região
  credentials: {
    accessKeyId: process.env.AWS_ACCESSKEYID,
    secretAccessKey: process.env.AWS_SECRETACCESSKEY,
  },
};

const snsConfig = {
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESSKEYID,
    secretAccessKey: process.env.AWS_SECRETACCESSKEY,
  },
};

const ReportStatus = Object.freeze({
  REPORTADO: 0,
  AVALIADO: 1,
  CONCLUIDO: 2,
});

const ReportSeverity = Object.freeze({
  GRAVE: 0,
  MODERADO: 1,
});

export { dynamoConfig, s3Config, snsConfig, ReportStatus, ReportSeverity };
