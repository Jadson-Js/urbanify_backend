import { DynamoDBClient, GetItemCommand } from "@aws-sdk/client-dynamodb";
import { dynamoConfig } from "../config/environment.js";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";

const tableName = "users";
const client = new DynamoDBClient(dynamoConfig);
const dynamodb = DynamoDBDocumentClient.from(client);

// Inseri um novo usuario a tabela
export const createUserModel = async (user) => {
  const params = {
    TableName: tableName,
    Item: user,
  };

  try {
    await dynamodb.send(new PutCommand(params));
    return user;
  } catch (error) {
    throw new Error("Erro ao cadastrar usuário " + error);
  }
};

// Busca usuario pelo email
export const getUserByEmailModel = async (email) => {
  const params = {
    TableName: tableName,
    Key: {
      email: { S: email },
    },
  };

  try {
    const command = new GetItemCommand(params);
    const data = await dynamodb.send(command);

    return data.Item;
  } catch (error) {
    throw new Error("Erro ao buscar usuário " + error);
  }
};
