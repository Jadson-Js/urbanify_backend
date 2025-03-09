// IMPORTANDO DEPENDENCIAS
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";

// IMPORTANDO CONFIGS
import { dynamoConfig, sesConfig } from "../config/environment.js";

// IMPORTANDO UTILS
import AppError from "../utils/AppError.js";

// SETUP
const tableName = "users";
const client = new DynamoDBClient(dynamoConfig);
const dynamodb = DynamoDBDocumentClient.from(client);
const sesClient = new SESClient(sesConfig);

class UserModel {
  // AÇÕES DE GET
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
      throw new AppError(
        404,
        "Usuario não encontrado",
        "Email incorreto ou inexistente"
      );
    }
  }

  // AÇÕES DE CREATE
  async signup(user) {
    const params = {
      TableName: tableName,
      Item: user,
      ConditionExpression: "attribute_not_exists(email)",
    };

    try {
      const command = new PutCommand(params);
      const data = await dynamodb.send(command);

      return data;
    } catch (error) {
      // Classe para tratar erros dentro do event loop
      throw new AppError(400, "Usuario ja existente", "Digite outro email");
      // Informa status code, error e uma mensagem
    }
  }

  async sendEmail(params) {
    try {
      const command = new SendEmailCommand(params);
      const data = await sesClient.send(command);

      return data;
    } catch (err) {
      throw new AppError(400, "Email não enviado", "Email não foi enviado");
    }
  }

  // AÇÕES DE UPDATE
  async active(email) {
    const params = {
      TableName: tableName,
      Key: {
        email: email,
      },
      UpdateExpression: "SET active = :active",
      ExpressionAttributeValues: {
        ":active": true,
      },
      ReturnValues: "ALL_NEW",
    };

    try {
      const command = new UpdateCommand(params);
      const putReportId = await dynamodb.send(command);

      return putReportId;
    } catch (error) {
      throw new AppError(404, "Usuario não encontrado", "Digite outro email");
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
      const command = new UpdateCommand(params);
      const putReportId = await dynamodb.send(command);

      return putReportId;
    } catch (error) {
      throw new AppError(404, "Usuario não encontrado", "Digite outro email");
    }
  }

  async updatePassword(email, password) {
    const params = {
      TableName: tableName,
      Key: {
        email: email,
      },
      UpdateExpression: "SET password = :password",
      ExpressionAttributeValues: {
        ":password": password,
      },
      ReturnValues: "ALL_NEW",
    };

    try {
      const command = new UpdateCommand(params);
      const putReportId = await dynamodb.send(command);

      return putReportId;
    } catch (error) {
      throw new AppError(404, "Usuario não encontrado", "Digite outro email");
    }
  }
}

export default new UserModel();
