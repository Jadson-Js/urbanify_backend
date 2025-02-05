import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { dynamoConfig } from "../config/credentials.js";
import {
  DynamoDBDocumentClient,
  PutCommand,
  ScanCommand,
} from "@aws-sdk/lib-dynamodb";

const tableName = "historical";
const client = new DynamoDBClient(dynamoConfig);
const dynamodb = DynamoDBDocumentClient.from(client);

// Inseri um novo usuario a tabela
export const insertHistory = async (history) => {
  const params = {
    TableName: tableName,
    Item: history,
  };

  console.log(params);

  try {
    console.log(params);
    await dynamodb.send(new PutCommand(params));
    return history;
  } catch (error) {
    throw new Error("Erro ao cadastrar historico " + error);
  }
};

// Busca usuario pelo email
export const selectHistory = async () => {
  const params = {
    TableName: tableName,
  };

  try {
    const command = new ScanCommand(params);
    const data = await dynamodb.send(command);
    console.log(data);
    if (data.Items) {
      return data.Items; // Retorna o primeiro usuário encontrado
    }

    return null;
  } catch (error) {
    console.log(error);
    throw new Error("Erro ao buscar histórico " + error);
  }
};
