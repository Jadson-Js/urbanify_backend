// IMPORTANDO DEPENDENCIAS
import { checkSchema, validationResult } from "express-validator";

// IMPORTANDO UTILS
import AppError from "../../utils/AppError.js";

class Validator {
  email() {
    return checkSchema({
      email: {
        isEmail: {
          errorMessage: "Incorrect email", // Main message for invalid email format
        },
        notEmpty: {
          errorMessage: "Please provide the email", // Message for missing email input
        },
        isLength: {
          options: { max: 250 },
          errorMessage: "Your email cannot exceed 250 characters", // Message for overly long email input
        },
      },
    });
  }

  password() {
    return checkSchema({
      password: {
        isString: {
          errorMessage: "The password must be a string", // Ensures the token is provided as a valid string
        },
        isLength: {
          options: { min: 2, max: 64 },
          errorMessage: "The token must be between 2 and 64 characters long", // Specifies the valid length for the token
        },
        notEmpty: {
          errorMessage: "Please provide the password", // Informs the user to include the token
        },
      },
    });
  }

  accessToken() {
    return checkSchema({
      accessToken: {
        isString: {
          errorMessage: "The token must be a string", // Ensures the token is provided as a valid string
        },
        isLength: {
          options: { min: 10, max: 600 },
          errorMessage: "The token must be between 10 and 600 characters long", // Specifies the valid length for the token
        },
        notEmpty: {
          errorMessage: "Please provide the token", // Informs the user to include the token
        },
      },
    });
  }

  refreshToken() {
    return checkSchema({
      refreshToken: {
        isString: {
          errorMessage: "The token must be a string", // Ensures the refresh token is provided as a valid string
        },
        isLength: {
          options: { min: 10, max: 600 },
          errorMessage: "The token must be between 10 and 600 characters long", // Specifies the valid length for the refresh token
        },
        notEmpty: {
          errorMessage: "Please provide the token", // Informs the user to fill in the refresh token field
        },
      },
    });
  }

  authToken() {
    return checkSchema({
      authToken: {
        isString: {
          errorMessage: "The token must be a string", // Ensures the refresh token is provided as a valid string
        },
        isLength: {
          options: { min: 10, max: 5000 },
          errorMessage: "The token must be between 10 and 600 characters long", // Specifies the valid length for the refresh token
        },
        notEmpty: {
          errorMessage: "Please provide the token", // Informs the user to fill in the refresh token field
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
        400, // Appropriate HTTP status code for missing required fields
        "Fields not provided", // Main message indicating missing fields
        "Latitude and longitude are required fields." // Detailed explanation emphasizing the importance of the fields
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
        400, // Appropriate HTTP status code for missing required fields
        "Fields not provided", // Main message indicating missing fields
        `'${emptyField[0]}' are required fields.` // Detailed explanation emphasizing the importance of the fields
      );
    }

    // Verificando tamanho dos campos
    const invalidField = Object.entries(fields).find(
      ([_, value]) => value.length < 2 || value.length > 125
    );
    if (invalidField) {
      throw new AppError(
        400, // Appropriate HTTP status code for invalid input length
        "Invalid character count", // Main message indicating an issue with field length
        `The field '${invalidField[0]}' must contain between 2 and 125 characters.` // Detailed message specifying the valid character range
      );
    }

    // Limites definidos
    const limiteEsquerdo = -50;
    const limiteDireito = -40;
    const limiteInferior = -10;
    const limiteSuperior = -1;

    // Função para validar as coordenadas
    function validarCoordenadas() {
      return (
        parseFloat(coordinates.longitude) >= limiteEsquerdo &&
        parseFloat(coordinates.longitude) <= limiteDireito &&
        parseFloat(coordinates.latitude) >= limiteInferior &&
        parseFloat(coordinates.latitude) <= limiteSuperior
      );
    }

    // Verificar e exibir a resposta
    if (!validarCoordenadas()) {
      throw new AppError(
        400, // Appropriate HTTP status code for invalid coordinates
        "Coordinates out of service area", // Main message indicating invalid coordinates
        "The provided coordinates are outside the service area." // Detailed explanation emphasizing the issue
      );
    }

    next();
  }

  pathReport(req, res, next) {
    const status = Number(req.body.status);

    if (!status) {
      throw new AppError(
        400, // Appropriate HTTP status code for missing required fields
        "Fields not provided", // Main message indicating missing fields
        `'status' are required fields.` // Detailed explanation emphasizing the importance of the fields
      );
    }

    if (status != 1 && status != 2) {
      throw new AppError(
        400, // Appropriate HTTP status code for invalid input length
        "Invalid character count", // Main message indicating an issue with field length
        `The field 'status' must contain between 1 and 2 values.` // Detailed message specifying the valid character range
      );
    }

    next();
  }

  address() {
    return checkSchema({
      address: {
        isString: {
          errorMessage: "The address must be a string", // Ensures the address is provided as a valid string
        },
        isLength: {
          options: { min: 2, max: 125 },
          errorMessage: "The address must be between 2 and 125 characters long", // Specifies the valid length for the address field
        },
        notEmpty: {
          errorMessage: "Please provide the address", // Informs the user to fill in the address field
        },
      },
    });
  }

  geohash() {
    return checkSchema({
      geohash: {
        isString: {
          errorMessage: "The geohash must be a string", // Ensures the geohash is a valid string
        },
        isLength: {
          options: { min: 6, max: 8 },
          errorMessage: "The geohash must be between 6 and 8 characters long", // Specifies the valid length for the geohash
        },
        notEmpty: {
          errorMessage: "Please provide the geohash", // Informs the user to fill in the geohash field
        },
      },
    });
  }

  status() {
    return checkSchema({
      status: {
        isNumeric: {
          errorMessage: "The status must be a number", // Ensures the status is provided as a numeric value
        },
        isLength: {
          options: { min: 0, max: 2 },
          errorMessage: "The status must contain between 0 and 2 digits", // Corrected and clarified length requirement message
        },
        notEmpty: {
          errorMessage: "Please provide the status", // Informs the user to fill in the status field
        },
      },
    });
  }

  id() {
    return checkSchema({
      id: {
        isString: {
          errorMessage: "The ID must be a string", // Ensures the ID is provided as a valid string
        },
        isLength: {
          options: { min: 4, max: 64 },
          errorMessage: "The ID must be between 4 and 64 characters long", // Specifies the valid length for the ID
        },
        notEmpty: {
          errorMessage: "Please provide the ID", // Informs the user to fill in the ID field
        },
      },
    });
  }

  created_at() {
    return checkSchema({
      created_at: {
        isString: {
          errorMessage: "The created_at must be a string", // Ensures the created_at field is provided as a valid string
        },
        isLength: {
          options: { min: 4, max: 64 },
          errorMessage:
            "The created_at must be between 4 and 64 characters long", // Specifies the valid length for the created_at field
        },
        notEmpty: {
          errorMessage: "Please provide the created_at field", // Informs the user to fill in the created_at field
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
