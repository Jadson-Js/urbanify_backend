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
import { dynamoConfig, s3Config, snsConfig } from "../config/environment.js";

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
      throw new AppError(
        404,
        "Usuario não encontrado",
        "Email incorreto ou inexistente"
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
        400,
        "Prefixo mal definido",
        "Prefixo não foi enviado ou está mal definido"
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
        400,
        "Arquivo não enviado",
        "Arquivo pode está corrompido"
      );
    }
  }

  async uploadFile(file) {
    try {
      const response = await s3Client.send(new PutObjectCommand(file));

      return response;
    } catch (error) {
      throw new AppError(
        400,
        "Arquivo não enviado",
        "Arquivo pode está corrompido"
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
        400,
        "Children mal definido",
        "Report ou children podem está mal definido"
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
      console.log(error);

      throw new AppError(
        400,
        "Parametros mal definido",
        "Parametros foram mal definidos "
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
        400,
        "Index ou Local mal definidos",
        "Address, Geohash ou children podem está mal definido"
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
        404,
        "Report não encontrado",
        "Address ou Geohash podem está mal definido"
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
        400,
        "Lista mal definida",
        "A lista de arquivos não encontrada ou mal definida"
      );
    }
  }
}

export default new ReportModel();
