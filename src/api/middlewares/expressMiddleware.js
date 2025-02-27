import { checkSchema, validationResult } from "express-validator";
import AppError from "../../utils/AppError.js";

// Classe onde terá as validações do express-validator usando Schema
class Validator {
  // Metodo responsavel por lançar os erros dos usuarios
  user() {
    return checkSchema({
      email: {
        isEmail: {
          errorMessage: "Email incorreto",
        },
        notEmpty: {
          errorMessage: "preencha o email",
        },
        isLength: {
          options: { max: 250 },
          errorMessage: "Senha não pode conter mais de 250 caracteres",
        },
      },
      password: {
        isLength: {
          options: { min: 6, max: 64 },
          errorMessage:
            "Senha não pode conter menos de 6 ou mais de 64 caracteres",
        },
        notEmpty: {
          errorMessage: "preencha a senha",
        },
      },
    });
  }

  postLog() {
    return checkSchema({
      status: {
        isString: {
          errorMessage: "Status deve ser uma string",
        },
        notEmpty: {
          errorMessage: "Preencha o status",
        },
        isLength: {
          options: { min: 3, max: 15 },
          errorMessage:
            "Status não pode conter menos de 3 ou mais de 15 caracteres",
        },
      },
      district: {
        isString: {
          errorMessage: "Strict deve ser uma string",
        },
        notEmpty: {
          errorMessage: "Preencha o district",
        },
        isLength: {
          options: { min: 3, max: 62 },
          errorMessage:
            "District não pode conter menos de 3 ou mais de 62 caracteres",
        },
      },
      street: {
        isString: {
          errorMessage: "Street deve ser uma string",
        },
        notEmpty: {
          errorMessage: "Preencha a street",
        },
        isLength: {
          options: { min: 3, max: 100 },
          errorMessage:
            "Street não pode conter menos de 3 ou mais de 100 caracteres",
        },
      },
    });
  }

  getReport() {
    return checkSchema({
      address: {
        isString: {
          errorMessage: "address deve ser uma string",
        },
        notEmpty: {
          errorMessage: "Preencha o address",
        },
        isLength: {
          options: { min: 4, max: 125 },
          errorMessage:
            "address não pode conter menos de 4 ou mais de 125 caracteres",
        },
      },
      geohash: {
        isString: {
          errorMessage: "geohash deve ser uma string",
        },
        notEmpty: {
          errorMessage: "Preencha o geohash",
        },
        isLength: {
          options: { min: 6, max: 8 },
          errorMessage:
            "geohash não pode conter menos de 3 ou mais de 62 caracteres",
        },
      },
    });
  }

  getStatus() {
    return checkSchema({
      address: {
        isString: {
          errorMessage: "address deve ser uma string",
        },
        notEmpty: {
          errorMessage: "Preencha o address",
        },
        isLength: {
          options: { min: 4, max: 125 },
          errorMessage:
            "address não pode conter menos de 4 ou mais de 125 caracteres",
        },
      },
      geohash: {
        isString: {
          errorMessage: "geohash deve ser uma string",
        },
        notEmpty: {
          errorMessage: "Preencha o geohash",
        },
        isLength: {
          options: { min: 6, max: 8 },
          errorMessage:
            "geohash não pode conter menos de 3 ou mais de 62 caracteres",
        },
      },
    });
  }

  postReport(req, res, next) {
    const { subregion, district, street, severity, coordinates } = JSON.parse(
      req.body.data
    );

    // Validando se campo estão vazios
    if (
      !subregion ||
      !district ||
      !street ||
      !severity ||
      !coordinates.latitude ||
      !coordinates.longitude
    ) {
      throw new AppError(
        400,
        "Campos não informado",
        "Verifique se todos os campos nescessarios para cadastro de report estão corretos"
      );
    }

    if (
      subregion.length > 1 &&
      subregion.length < 125 &&
      district.length > 1 &&
      district.length < 125 &&
      street.length > 1 &&
      street.length < 125 &&
      severity.length > 1 &&
      severity.length < 125 &&
      severity.length > 1 &&
      severity.length < 125 &&
      coordinates.latitude.length > 1 &&
      coordinates.latitude.length < 250 &&
      coordinates.longitude.length > 1 &&
      coordinates.longitude.length < 250
    ) {
      next();
    } else {
      throw new AppError(
        400,
        "Quantidade de caracteres inadequados",
        "Verifique se os campos informados possuem a quantidade de caracteres adequados"
      );
    }
  }

  patchStatusReport() {
    return checkSchema({
      address: {
        isString: {
          errorMessage: "Address deve ser uma string",
        },
        notEmpty: {
          errorMessage: "Preencha o address",
        },
        isLength: {
          options: { min: 4, max: 125 },
          errorMessage:
            "address não pode conter menos de 4 ou mais de 125 caracteres",
        },
      },
      geohash: {
        isString: {
          errorMessage: "geohash deve ser uma string",
        },
        notEmpty: {
          errorMessage: "Preencha o geohash",
        },
        isLength: {
          options: { min: 6, max: 8 },
          errorMessage:
            "geohash não pode conter menos de 3 ou mais de 62 caracteres",
        },
      },
      status: {
        isInt: {
          options: { min: 0, max: 3 },
          errorMessage: "Status deve ser um número entre 0 e 3",
        },
        notEmpty: {
          errorMessage: "Preencha o status",
        },
      },
    });
  }

  // Metodo responsavel por tratar os erros
  validate(req, res, next) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    next();
  }
}

export default new Validator();
