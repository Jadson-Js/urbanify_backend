import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { dynamoConfig } from "../config/environment.js";
import AppError from "../utils/AppError.js";
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";

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
      // Classe para tratar erros dentro do event loop
      throw new AppError(400, "Usuario ja existente", "Digite outro email");
      // Informa status code, error e uma mensagem
    }
  }

  async getByEmail(email) {
    const params = {
      TableName: tableName,
      Key: {
        email: email,
      },
    };

    try {
      const command = new GetCommand(params);
      const data = await dynamodb.send(command);

      return data.Item;
    } catch (error) {
      throw new Error("Erro ao buscar usuário " + error);
    }
  }

  async addReport(user_email, report_id) {
    const params = {
      TableName: tableName,
      Key: {
        email: user_email,
      },
      UpdateExpression: "SET reports_id = list_append(reports_id, :report_id)",
      ExpressionAttributeValues: {
        ":report_id": [report_id],
      },
      ReturnValues: "ALL_NEW",
    };

    try {
      const putReportId = await dynamodb.send(new UpdateCommand(params));

      return putReportId;
    } catch (error) {
      console.log(error);
      throw new Error("Erro no update user" + error);
    }
  }
}

export default new UserModel();
