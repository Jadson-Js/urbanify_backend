import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { dynamoConfig } from "../config/environment.js";
import {
  DynamoDBDocumentClient,
  PutCommand,
  ScanCommand,
} from "@aws-sdk/lib-dynamodb";

const tableName = "logs";
const client = new DynamoDBClient(dynamoConfig);
const dynamodb = DynamoDBDocumentClient.from(client);

class LogModel {
  async get() {
    const params = {
      TableName: tableName,
    };

    try {
      const command = new ScanCommand(params);
      const data = await dynamodb.send(command);

      return data.Items;
    } catch (error) {
      throw new Error("Erro ao buscar logs " + error);
    }
  }

  async create(log) {
    const params = {
      TableName: tableName,
      Item: log,
    };

    try {
      await dynamodb.send(new PutCommand(params));

      return log;
    } catch (error) {
      throw new Error("Erro ao cadastrar log " + error);
    }
  }
}

export default new LogModel();
