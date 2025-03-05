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
  // Ações de GET
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
        404,
        "Usuario não encontrado",
        "Email incorreto ou inexistente"
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
        404,
        "Report não encontrado",
        "Id ou created_at foram mal definidos ou não encontrado"
      );
    }
  }

  async getFilesByPrefix(data) {
    try {
      const listResponse = await s3Client.send(new ListObjectsV2Command(data));

      return listResponse;
    } catch (error) {
      throw new AppError(
        404,
        "Prefixos não encontrado",
        "Tente outro prefixo mais tarde"
      );
    }
  }

  async generatePresignedUrl(Contents) {
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
        400,
        "Prefixo mal definido",
        "Prefixo não foi enviado ou está mal definido"
      );
    }
  }
}

export default new ResolvedModel();
