import { DynamoDBClient, GetItemCommand } from "@aws-sdk/client-dynamodb";
import { dynamoConfig } from "../config/environment.js";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";

const tableName = "users";
const client = new DynamoDBClient(dynamoConfig);
const dynamodb = DynamoDBDocumentClient.from(client);

class UserModel {
  async signup(user) {
    const params = {
      TableName: tableName,
      Item: user,
      ConditionExpression: "attribute_not_exists(email)",
    };

    try {
      await dynamodb.send(new PutCommand(params));
      return user;
    } catch (error) {
      throw new Error("Erro ao cadastrar usuário " + error);
    }
  }

  async login(email) {
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
  }
}

export default new UserModel();
