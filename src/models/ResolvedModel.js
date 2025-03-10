import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { dynamoConfig, s3Config } from "../config/environment.js";
import AppError from "../utils/AppError.js";
import {
  S3Client,
  GetObjectCommand,
  ListObjectsV2Command,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import {
  DynamoDBDocumentClient,
  ScanCommand,
  GetCommand,
  PutCommand,
} from "@aws-sdk/lib-dynamodb";
const tableName = "resolved_reports";
const client = new DynamoDBClient(dynamoConfig);
const dynamodb = DynamoDBDocumentClient.from(client);
const s3Client = new S3Client(s3Config);

class ResolvedModel {
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
      throw new AppError(
        404, // Código de status apropriado para recursos ou usuários não encontrados
        "User not found",
        "Incorrect or non-existent email."
      );
    }
  }

  async getByKeys(data) {
    const params = {
      TableName: tableName,
      Key: {
        id: data.id,
        created_at: data.created_at,
      },
    };

    try {
      const command = new GetCommand(params);
      const data = await dynamodb.send(command);

      return data.Item;
    } catch (error) {
      throw new AppError(
        404, // Código de status apropriado para recursos não encontrados
        "Report not found",
        "Id or created_at were malformed or not found."
      );
    }
  }

  async getFilesByPrefix(data) {
    try {
      const listResponse = await s3Client.send(new ListObjectsV2Command(data));

      return listResponse;
    } catch (error) {
      throw new AppError(
        404, // Código de status apropriado para recursos não encontrados
        "Prefixes not found",
        "Please try another prefix later."
      );
    }
  }

  async getPresignedUrl(Contents) {
    try {
      const urls = await Promise.all(
        Contents.map(async (item) => {
          const paramsToGet = {
            Bucket: process.env.S3_BUCKET,
            Key: item.Key,
          };

          const command = new GetObjectCommand(paramsToGet);
          const url = await getSignedUrl(s3Client, command, { expiresIn: 300 });
          return url;
        })
      );

      return urls;
    } catch (error) {
      throw new AppError(
        400, // Código de status apropriado para entrada de dados inválida
        "Malformed prefix",
        "The prefix was not provided or is malformed."
      );
    }
  }

  async create(data) {
    const params = {
      TableName: tableName,
      Item: data,
    };

    try {
      const command = new PutCommand(params);
      await dynamodb.send(command);

      return data;
    } catch (error) {
      throw new AppError(
        400, // Código de status apropriado para erros internos do servidor
        "Malformed report",
        "The report was not provided or is malformed."
      );
    }
  }
}

export default new ResolvedModel();
