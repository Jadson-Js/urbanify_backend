import dotenv from "dotenv";
dotenv.config();

export const AwsConfig = {
  region: process.env.DYNAMODB_REGION,
  endpoint: process.env.DYNAMODB_ENDPOINT,
  credentials: {
    accessKeyId: process.env.DYNAMODB_ACCESSKEYID,
    secretAccessKey: process.env.DYNAMODB_SECRETACCESSKEY,
  },
};
