import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { dynamoConfig } from "../config/credentials.js";
import {
  DynamoDBDocumentClient,
  PutCommand,
  ScanCommand,
} from "@aws-sdk/lib-dynamodb";

const tableName = "logs";
const client = new DynamoDBClient(dynamoConfig);
const dynamodb = DynamoDBDocumentClient.from(client);

// Busca usuario pelo email
export const selectLogs = async () => {
  const params = {
    TableName: tableName,
  };

  try {
    const command = new ScanCommand(params);
    const data = await dynamodb.send(command);

    if (data.Items) {
      return data.Items; // Retorna o primeiro usuário encontrado
    }

    return null;
  } catch (error) {
    throw new Error("Erro ao buscar logs " + error);
  }
};

// Inseri um novo usuario a tabela
export const insertLog = async (log) => {
  const params = {
    TableName: tableName,
    Item: log,
  };

  try {
    await dynamodb.send(new PutCommand(params));
  } catch (error) {
    throw new Error("Erro ao cadastrar log " + error);
  }
};
