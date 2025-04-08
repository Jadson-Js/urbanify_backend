// IMPORTANDO DEPENDENCIAS
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  ScanCommand,
  GetCommand,
  PutCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import { OAuth2Client } from "google-auth-library";

// IMPORTANDO CONFIGS
import {
  dynamoConfig,
  sesConfig,
  GOOGLE_CLIENT_ID,
} from "../config/environment.js";

// IMPORTANDO UTILS
import AppError from "../utils/AppError.js";

// SETUP
const tableName = "users";
const client = new DynamoDBClient(dynamoConfig);
const dynamodb = DynamoDBDocumentClient.from(client);
const sesClient = new SESClient(sesConfig);
const clientGoogle = new OAuth2Client(GOOGLE_CLIENT_ID);

class UserModel {
  // AÇÕES DE GET
  async get() {
    const params = {
      TableName: tableName,
    };

    try {
      const command = new ScanCommand(params);
      const data = await dynamodb.send(command);

      return data.Items;
    } catch (error) {
      throw new AppError();
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
      throw new AppError(
        404, // Código de status apropriado para recursos ou usuários não encontrados
        "User not found",
        "Incorrect or non-existent email."
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
      throw new AppError(
        409, // Código de status apropriado para entrada de dados inválida
        "User already exists",
        "Please use a different email."
      );

      // Informa status code, error e uma mensagem
    }
  }

  async authGoogle(authToken) {
    try {
      const ticket = await clientGoogle.verifyIdToken({
        idToken: authToken,
        audience: GOOGLE_CLIENT_ID,
      });

      const payload = ticket.getPayload();
      const { email } = payload;

      // Simula cadastro/login (aqui entraria seu banco)

      return email;
    } catch (err) {
      console.log(err);

      throw new AppError();
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
      throw new AppError(
        404, // Código de status apropriado para recursos ou usuários não encontrados
        "User not found",
        "Please provide a different email."
      );
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
      throw new AppError(
        404, // Código de status apropriado para recursos ou usuários não encontrados
        "User not found",
        "Please enter a different email."
      );
    }
  }

  async addServiceCounter(user_emails) {
    try {
      const updatePromises = user_emails.map(async (email) => {
        const params = {
          TableName: tableName,
          Key: { email },
          UpdateExpression:
            "SET service_counter = if_not_exists(service_counter, :start) + :increment",
          ExpressionAttributeValues: {
            ":start": 0,
            ":increment": 1,
          },
          ReturnValues: "ALL_NEW",
        };

        const command = new UpdateCommand(params);
        return dynamodb.send(command);
      });

      const results = await Promise.all(updatePromises);
      return results;
    } catch (error) {
      console.error(error);
      throw new AppError(500, "Erro ao atualizar contadores", error.message);
    }
  }
}

export default new UserModel();
