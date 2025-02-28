import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { dynamoConfig, snsConfig } from "../config/environment.js";
import AppError from "../utils/AppError.js";
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";
import {
  SNSClient,
  SubscribeCommand,
  ListSubscriptionsByTopicCommand,
} from "@aws-sdk/client-sns";
const snsClient = new SNSClient(snsConfig);

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
      throw new AppError(
        404,
        "Usuario não encontrado",
        "Email incorreto ou inexistente"
      );
    }
  }

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
      const putReportId = await dynamodb.send(new UpdateCommand(params));

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
      const putReportId = await dynamodb.send(new UpdateCommand(params));

      return putReportId;
    } catch (error) {
      throw new AppError(404, "Usuario não encontrado", "Digite outro email");
    }
  }

  async snsSubscribe(params) {
    try {
      const data = await snsClient.send(new SubscribeCommand(params));

      return data;
    } catch (err) {
      console.log(err);
      throw new AppError(400, "Email não enviado", "Email não foi enviado");
    }
  }

  async isSubscribe(params) {
    const { user_email, topic_arn } = params;

    const data = await snsClient.send(
      new ListSubscriptionsByTopicCommand({ TopicArn: topic_arn })
    );

    const subscription = data.Subscriptions.find(
      (sub) => sub.Endpoint === user_email
    );

    return subscription;
  }
}

export default new UserModel();
