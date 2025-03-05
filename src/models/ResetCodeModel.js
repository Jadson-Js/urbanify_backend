import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { dynamoConfig, snsConfig } from "../config/environment.js";
import AppError from "../utils/AppError.js";
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  UpdateCommand,
  DeleteCommand,
} from "@aws-sdk/lib-dynamodb";
import {
  SNSClient,
  SubscribeCommand,
  ListSubscriptionsByTopicCommand,
} from "@aws-sdk/client-sns";
const snsClient = new SNSClient(snsConfig);

const tableName = "reset_codes";
const client = new DynamoDBClient(dynamoConfig);
const dynamodb = DynamoDBDocumentClient.from(client);

class ResetCodeModel {
  async create(code) {
    const params = {
      TableName: tableName,
      Item: code,
      ConditionExpression:
        "attribute_not_exists(email) AND attribute_not_exists(created_at)",
    };

    try {
      await dynamodb.send(new PutCommand(params));
      return code;
    } catch (error) {
      // Classe para tratar erros dentro do event loop
      throw new AppError(400, "Codigo ja existente", "Digite outro email");
      // Informa status code, error e uma mensagem
    }
  }

  async getByKeys(email, created_at) {
    const params = {
      TableName: tableName,
      Key: {
        email,
        created_at,
      },
    };

    try {
      const command = new GetCommand(params);
      const data = await dynamodb.send(command);

      return data.Item;
    } catch (error) {
      throw new AppError(
        404,
        "Reset code não encontrado",
        "Email ou created_at incorreto ou inexistente"
      );
    }
  }

  async delete(email, created_at) {
    const params = {
      TableName: tableName,
      Key: {
        email,
        created_at,
      },
    };

    try {
      const deleteReport = await dynamodb.send(new DeleteCommand(params));

      return deleteReport;
    } catch (error) {
      throw new AppError(
        404,
        "Reset code não encontrado",
        "Email ou created_at podem está mal definido"
      );
    }
  }
}

export default new ResetCodeModel();
