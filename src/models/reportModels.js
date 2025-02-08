import { DynamoDBClient, GetItemCommand } from "@aws-sdk/client-dynamodb";
import { dynamoConfig, s3Config } from "../config/environment.js";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import {
  DynamoDBDocumentClient,
  PutCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";
const tableName = "reports";
const client = new DynamoDBClient(dynamoConfig);
const dynamodb = DynamoDBDocumentClient.from(client);
const s3Client = new S3Client(s3Config);

const getReportByLocal = async (district, geohash) => {
  const params = {
    TableName: tableName,
    Key: {
      district: { S: district },
      geohash: { S: geohash },
    },
  };

  try {
    const command = new GetItemCommand(params);
    const data = await dynamodb.send(command);

    return data.Item;
  } catch (error) {
    throw new Error("Erro ao buscar report " + error);
  }
};

const uploadFile = async (file) => {
  try {
    // envia o objeto tratado para o S3
    const response = await s3Client.send(new PutObjectCommand(file));

    return response;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
};

// Inseri um novo usuario a tabela
const createReport = async (report) => {
  const params = {
    TableName: tableName,
    Item: report,
    ConditionExpression:
      "attribute_not_exists(district) AND attribute_not_exists(geohash)",
  };

  try {
    await dynamodb.send(new PutCommand(params));

    return report;
  } catch (error) {
    console.log(error);

    throw new Error("Erro ao cadastrar report" + error);
  }
};

const updateReport = async (children, reportFather) => {
  const params = {
    TableName: tableName,
    Key: {
      district: reportFather.district.S,
      geohash: reportFather.geohash.S,
    },
    UpdateExpression: "SET childrens = list_append(childrens, :children)",
    ExpressionAttributeValues: {
      ":children": [children],
    },
    ReturnValues: "ALL_NEW",
  };

  try {
    const children = await dynamodb.send(new UpdateCommand(params));

    return children;
  } catch (error) {
    throw new Error("Erro no update report" + error);
  }
};

export { getReportByLocal, uploadFile, createReport, updateReport };
