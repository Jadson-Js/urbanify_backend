import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { dynamoConfig, s3Config } from "../config/environment.js";
import {
  S3Client,
  PutObjectCommand,
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
const tableName = "reports";
const client = new DynamoDBClient(dynamoConfig);
const dynamodb = DynamoDBDocumentClient.from(client);
const s3Client = new S3Client(s3Config);

class ReportModel {
  async get() {
    const params = {
      TableName: tableName,
    };

    try {
      const command = new ScanCommand(params);
      const data = await dynamodb.send(command);

      return data.Items;
    } catch (error) {
      console.log(error);
      throw new Error("Erro ao buscar reports " + error);
    }
  }

  async getByListId(reports_id) {
    const params = {
      TableName: tableName,
      FilterExpression:
        "id IN (" + reports_id.map((_, item) => `:id${item}`).join(", ") + ")",
      ExpressionAttributeValues: Object.fromEntries(
        reports_id.map((id, item) => [`:id${item}`, id])
      ),
    };

    try {
      const command = new ScanCommand(params);
      const response = await client.send(command);
      return response.Items;
    } catch (error) {
      console.log(error);
      throw new Error("Erro ao buscar reports " + error);
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
      console.log(error);
      throw new Error("Erro ao buscar report " + error);
    }
  }

  async uploadFile(file) {
    try {
      const response = await s3Client.send(new PutObjectCommand(file));

      return response;
    } catch (error) {
      console.error("Error uploading file:", error);
      throw error;
    }
  }

  async create(report) {
    const params = {
      TableName: tableName,
      Item: report,
      ConditionExpression:
        "attribute_not_exists(address) AND attribute_not_exists(geohash)",
    };

    try {
      await dynamodb.send(new PutCommand(params));

      return report;
    } catch (error) {
      console.log(error);

      throw new Error("Erro ao cadastrar report" + error);
    }
  }

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
      console.log(error);
      throw new Error("Erro no update report" + error);
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
      console.log(error);
      throw new Error("Erro no update report" + error);
    }
  }

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
      console.log(error);
      throw new Error("Erro no update report" + error);
    }
  }

  async getFilesByPrefix(data) {
    try {
      const listResponse = await s3Client.send(new ListObjectsV2Command(data));

      return listResponse;
    } catch (error) {
      console.log(error);
      throw new Error("Erro no delete dos arquivos" + error);
    }
  }

  async deleteFiles(list) {
    try {
      const deleteResponse = await s3Client.send(
        new DeleteObjectsCommand(list)
      );

      return deleteResponse;
    } catch (error) {
      console.log(error);
      throw new Error("Erro no delete dos arquivos" + error);
    }
  }
}

export default new ReportModel();
