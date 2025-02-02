import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  PutCommand,
  ScanCommand,
} from "@aws-sdk/lib-dynamodb";
import { AwsConfig } from "../config/credentials.js";

const tableName = "users";
const client = new DynamoDBClient(AwsConfig);
const dynamodb = DynamoDBDocumentClient.from(client);

// Inseri um novo usuario a tabela
export const insertUser = async (user) => {
  const params = {
    TableName: tableName,
    Item: user,
  };

  try {
    await dynamodb.send(new PutCommand(params));
    return user;
  } catch (error) {
    console.error("Erro ao cadastrar usuário:", error);
    throw new Error("Erro ao cadastrar usuário");
  }
};

// Busca usuario pelo email
export const selectUserByEmail = async (email) => {
  const params = {
    TableName: tableName,
    FilterExpression: "email = :email",
    ExpressionAttributeValues: {
      ":email": email,
    },
  };

  try {
    const command = new ScanCommand(params);
    const data = await dynamodb.send(command);

    if (data.Items && data.Items.length > 0) {
      return data.Items[0]; // Retorna o primeiro usuário encontrado
    }
    return null;
  } catch (error) {
    console.error("Erro ao buscar usuário:", error);
    throw new Error("Erro ao buscar usuário");
  }
};
