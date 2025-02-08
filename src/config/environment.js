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

export { dynamoConfig, s3Config };
