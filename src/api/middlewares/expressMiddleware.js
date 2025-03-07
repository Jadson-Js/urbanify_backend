// IMPORTANDO DEPENDENCIAS
import { checkSchema, validationResult } from "express-validator";

// IMPORTANDO UTILS
import AppError from "../../utils/AppError.js";

class Validator {
  email() {
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
          errorMessage: "Seu email não pode conter mais de 250 caracteres",
        },
      },
    });
  }

  password() {
    return checkSchema({
      password: {
        isString: {
          errorMessage: "Senha deve ser uma string",
        },
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

  newPassword() {
    return checkSchema({
      new_password: {
        isString: {
          errorMessage: "Senha deve ser uma string",
        },
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

  accessToken() {
    return checkSchema({
      accessToken: {
        isString: {
          errorMessage: "O token deve ser uma string",
        },
        isLength: {
          options: { min: 10, max: 600 },
          errorMessage:
            "Token não pode conter menos de 10 ou mais de 600 caracteres",
        },
        notEmpty: {
          errorMessage: "preencha o token",
        },
      },
    });
  }

  refreshToken() {
    return checkSchema({
      refreshToken: {
        isString: {
          errorMessage: "O token deve ser uma string",
        },
        isLength: {
          options: { min: 10, max: 600 },
          errorMessage:
            "Token não pode conter menos de 10 ou mais de 600 caracteres",
        },
        notEmpty: {
          errorMessage: "preencha o token",
        },
      },
    });
  }

  postReport(req, res, next) {
    const { subregion, district, street, severity, coordinates } = JSON.parse(
      req.body.data
    );

    if (!coordinates?.latitude || !coordinates?.longitude) {
      throw new AppError(
        400,
        "Campos não informados",
        "Latitude e longitude são obrigatórias."
      );
    }

    // Lista de campos para validação
    const fields = {
      subregion,
      district,
      street,
      severity,
      latitude: coordinates.latitude,
      longitude: coordinates.longitude,
    };

    // Verificando campos vazios
    const emptyField = Object.entries(fields).find(
      ([_, value]) => !value || value.trim() === ""
    );
    if (emptyField) {
      throw new AppError(
        400,
        "Campos não informados",
        `O campo '${emptyField[0]}' é obrigatório.`
      );
    }

    // Verificando tamanho dos campos
    const invalidField = Object.entries(fields).find(
      ([_, value]) => value.length < 2 || value.length > 125
    );
    if (invalidField) {
      throw new AppError(
        400,
        "Quantidade de caracteres inadequada",
        `O campo '${invalidField[0]}' deve ter entre 2 e 125 caracteres.`
      );
    }

    next();
  }

  address() {
    return checkSchema({
      address: {
        isString: {
          errorMessage: "O address deve ser uma string",
        },
        isLength: {
          options: { min: 2, max: 125 },
          errorMessage:
            "Address não pode conter menos de 2 ou mais de 125 caracteres",
        },
        notEmpty: {
          errorMessage: "Preencha o address",
        },
      },
    });
  }

  geohash() {
    return checkSchema({
      geohash: {
        isString: {
          errorMessage: "O geohash deve ser uma string",
        },
        isLength: {
          options: { min: 6, max: 8 },
          errorMessage:
            "geohash não pode conter menos de 2 ou mais de 125 caracteres",
        },
        notEmpty: {
          errorMessage: "Preencha o geohash",
        },
      },
    });
  }

  status() {
    return checkSchema({
      status: {
        isNumeric: {
          errorMessage: "O status deve ser um number",
        },
        isLength: {
          options: { min: 0, max: 2 },
          errorMessage:
            "geohash não pode conter menos de 0 ou mais de 2 caracteres",
        },
        notEmpty: {
          errorMessage: "Preencha o status",
        },
      },
    });
  }

  id() {
    return checkSchema({
      id: {
        isString: {
          errorMessage: "O id deve ser uma string",
        },
        isLength: {
          options: { min: 4, max: 64 },
          errorMessage:
            "Id não pode conter menos de 4 ou mais de 64 caracteres",
        },
        notEmpty: {
          errorMessage: "Preencha o id",
        },
      },
    });
  }

  created_at() {
    return checkSchema({
      created_at: {
        isString: {
          errorMessage: "O created_at deve ser uma string",
        },
        isLength: {
          options: { min: 4, max: 64 },
          errorMessage:
            "created_at não pode conter menos de 4 ou mais de 64 caracteres",
        },
        notEmpty: {
          errorMessage: "Preencha o created_at",
        },
      },
    });
  }

  validate(req, res, next) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    next();
  }
}

export default new Validator();
