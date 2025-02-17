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
      throw new AppError(404, "Erro inespedado", "Tente novamente mais tarde");
    }
  }

  async create(log) {
    const params = {
      TableName: tableName,
      Item: log,
      ConditionExpression: "attribute_not_exists(id)",
    };

    try {
      await dynamodb.send(new PutCommand(params));

      return log;
    } catch (error) {
      throw new AppError(
        400,
        "Log mal definido",
        "Log mal definido ou id ja existente"
      );
    }
  }
}

export default new LogModel();
