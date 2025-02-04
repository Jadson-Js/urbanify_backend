import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { dynamoConfig, s3Config } from "../config/credentials.js";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import {
  DynamoDBDocumentClient,
  PutCommand,
  ScanCommand,
} from "@aws-sdk/lib-dynamodb";
const tableName = "reports";
const client = new DynamoDBClient(dynamoConfig);
const dynamodb = DynamoDBDocumentClient.from(client);
const s3Client = new S3Client(s3Config);

// Inseri um novo usuario a tabela
const insertReport = async (report) => {
  const params = {
    TableName: tableName,
    Item: report,
  };

  try {
    await dynamodb.send(new PutCommand(params));
    return report;
  } catch (error) {
    throw new Error("Erro ao cadastrar report" + error);
  }
};

const insertFileToS3 = async (file) => {
  try {
    // envia o objeto tratado para o S3
    const response = await s3Client.send(new PutObjectCommand(file));

    return response;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
};

export { insertReport, insertFileToS3 };
