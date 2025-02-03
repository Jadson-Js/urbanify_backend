import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { AwsConfig } from "../config/credentials.js";
import {
  DynamoDBDocumentClient,
  PutCommand,
  ScanCommand,
} from "@aws-sdk/lib-dynamodb";

const tableName = "reports";
const client = new DynamoDBClient(AwsConfig);
const dynamodb = DynamoDBDocumentClient.from(client);

// Inseri um novo usuario a tabela
export const insertReport = async (report) => {
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
