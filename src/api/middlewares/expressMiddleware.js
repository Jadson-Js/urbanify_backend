import { checkSchema, validationResult } from "express-validator";

// Classe onde terá as validações do express-validator usando Schema
class Validator {
  // Metodo responsavel por lançar os erros dos usuarios
  userSchema() {
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
