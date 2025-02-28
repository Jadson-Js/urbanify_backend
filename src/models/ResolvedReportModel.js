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

class ReportModel {
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

  async getByLocal(address, geohash) {
    const params = {
      TableName: tableName,
      Key: {
        address: address,
        geohash: geohash,
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
        "Address e Geohash foram mal definidos ou não encontrado"
      );
    }
  }

  async getByListId(reports_id) {
    const params = {
      TableName: tableName,
      FilterExpression: reports_id.map((_, i) => `id = :id${i}`).join(" OR "),
      ExpressionAttributeValues: Object.fromEntries(
        reports_id.map((id, i) => [`:id${i}`, id])
      ),
    };

    try {
      const command = new ScanCommand(params);
      const response = await client.send(command);
      return response.Items;
    } catch (error) {
      console.log(error);

      throw new AppError(
        404,
        "Report não encontrado",
        "Report id mal definido ou inexistente"
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

  // Ações de POST
  async create(report) {
    const params = {
      TableName: tableName,
      Item: report,
      ConditionExpression:
        "attribute_not_exists(address) AND attribute_not_exists(geohash) AND attribute_not_exists(id)",
    };

    try {
      await dynamodb.send(new PutCommand(params));

      return report;
    } catch (error) {
      throw new AppError(
        400,
        "Arquivo não enviado",
        "Arquivo pode está corrompido"
      );
    }
  }
}

export default new ReportModel();
