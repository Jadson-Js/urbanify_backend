import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { dynamoConfig, s3Config } from "../config/credentials.js";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import {
  DynamoDBDocumentClient,
  ScanCommand,
  PutCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";
const tableName = "reports";
const client = new DynamoDBClient(dynamoConfig);
const dynamodb = DynamoDBDocumentClient.from(client);
const s3Client = new S3Client(s3Config);

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

const updateReport = async (children) => {
  const params = {
    TableName: tableName,
    Key: {
      id: "a053a49cd0763fa81c14c8af7d211764e1d903626fd0e34df65d0128cc1173bb",
      created_at: "2025-02-07T15:47:59.615Z",
    },
    UpdateExpression: "SET childrens = list_append(childrens, :children)",
    ExpressionAttributeValues: {
      ":children": [children],
    },
    ReturnValues: "ALL_NEW",
  };

  try {
    await dynamodb.send(new UpdateCommand(params));
  } catch (error) {
    throw new Error("Erro no update report" + error);
  }
};

export { insertFileToS3, insertReport, updateReport };
