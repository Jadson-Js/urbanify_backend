// IMPORTANDO DEPENDENCIAS
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  ListObjectsV2Command,
  DeleteObjectsCommand,
} from "@aws-sdk/client-s3";
import {
  DynamoDBDocumentClient,
  ScanCommand,
  GetCommand,
  PutCommand,
  UpdateCommand,
  DeleteCommand,
} from "@aws-sdk/lib-dynamodb";

// IMPORTANDO CONFIGS
import { dynamoConfig, s3Config } from "../config/environment.js";

// IMPORTANDO UTILS
import AppError from "../utils/AppError.js";

// SETUP
const tableName = "reports";
const client = new DynamoDBClient(dynamoConfig);
const dynamodb = DynamoDBDocumentClient.from(client);
const s3Client = new S3Client(s3Config);

class ReportModel {
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
      throw new AppError(
        404, // Código de status apropriado para recursos ou relatórios não encontrados
        "Report not found",
        "Malformed or non-existent report ID."
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
        404, // Código de status apropriado para recursos não encontrados
        "Report not found",
        "Address and Geohash were malformed or not found."
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

  // AÇÕES DE POST
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
        400, // Código de status apropriado para entrada de dados inválida
        "File not sent",
        "The file may be corrupted."
      );
    }
  }

  async uploadFile(file) {
    try {
      const response = await s3Client.send(new PutObjectCommand(file));

      return response;
    } catch (error) {
      throw new AppError(
        400, // Código de status apropriado para erros de entrada de dados inválidos
        "File not sent",
        "The file may be corrupted."
      );
    }
  }

  // AÇÕES DE UPDATE
  async addChildren(children, report) {
    const params = {
      TableName: tableName,
      Key: {
        address: report.address,
        geohash: report.geohash,
      },
      UpdateExpression: "SET childrens = list_append(childrens, :children)",
      ExpressionAttributeValues: {
        ":children": [children],
      },
      ReturnValues: "ALL_NEW",
    };

    try {
      const putChildren = await dynamodb.send(new UpdateCommand(params));

      return putChildren;
    } catch (error) {
      throw new AppError(
        400, // Código de status apropriado para entrada de dados inválida
        "Malformed children",
        "The report or children may be malformed."
      );
    }
  }

  async updateStatus(data) {
    const params = {
      TableName: tableName,
      Key: {
        address: data.address,
        geohash: data.geohash,
      },
      UpdateExpression: "SET #status = :status",
      ExpressionAttributeNames: {
        "#status": "status", // Usando o alias #status para o atributo 'status'
      },
      ExpressionAttributeValues: {
        ":status": data.status,
      },
      ReturnValues: "ALL_NEW",
    };

    try {
      const response = await dynamodb.send(new UpdateCommand(params));

      return response.Attributes;
    } catch (error) {
      throw new AppError(
        400, // Código de status apropriado para entrada de dados inválida
        "Malformed parameters",
        "The parameters were malformed."
      );
    }
  }

  // AÇÕES DE DELETE
  async removeChildren(index, address, geohash) {
    const params = {
      TableName: tableName,
      Key: {
        address: address,
        geohash: geohash,
      },
      UpdateExpression: `REMOVE childrens[${index}]`,
      ReturnValues: "ALL_NEW",
    };

    try {
      const removeChildren = await dynamodb.send(new UpdateCommand(params));

      return removeChildren;
    } catch (error) {
      throw new AppError(
        400, // Código de status apropriado para entrada de dados inválida
        "Malformed Index or Location",
        "Address, Geohash, or children may be malformed."
      );
    }
  }

  async delete(address, geohash) {
    const params = {
      TableName: tableName,
      Key: {
        address: address,
        geohash: geohash,
      },
    };

    try {
      const deleteReport = await dynamodb.send(new DeleteCommand(params));

      return deleteReport;
    } catch (error) {
      throw new AppError(
        404, // Código de status apropriado para recursos não encontrados
        "Report not found",
        "Address or Geohash may be malformed."
      );
    }
  }

  async deleteFiles(list) {
    try {
      const deleteResponse = await s3Client.send(
        new DeleteObjectsCommand(list)
      );

      return deleteResponse;
    } catch (error) {
      throw new AppError(
        400, // Código de status apropriado para entrada de dados inválida
        "Malformed list",
        "The file list was not found or is malformed."
      );
    }
  }
}

export default new ReportModel();
