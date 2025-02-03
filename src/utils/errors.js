const errors = {
  user: {
    INVALID_EMAIL_OR_PASSWORD: {
      status: 401,
      message: "E-mail ou senha incorretos.",
    },
    EMAIL_ALREADY_IN_USE: {
      status: 409,
      message: "O e-mail informado já está em uso.",
    },
    USER_NOT_FOUND: { status: 404, message: "Usuário não encontrado." },
    INVALID_JWT: { status: 401, message: "Token JWT inválido ou expirado." },
    UNAUTHORIZED: { status: 403, message: "Acesso não autorizado." },
    MISSING_FIELDS: {
      status: 400,
      message: "Todos os campos são obrigatórios.",
    },
    PASSWORD_TOO_WEAK: {
      status: 400,
      message:
        "A senha deve ter pelo menos 8 caracteres, incluindo letras e números.",
    },
    ACCOUNT_LOCKED: {
      status: 423,
      message: "Conta bloqueada por múltiplas tentativas falhas de login.",
    },
    PASSWORD_RESET_REQUIRED: {
      status: 403,
      message: "É necessário redefinir a senha.",
    },
  },

  report: {
    INVALID_PARAMETERS: {
      status: 400,
      message: "Parâmetros inválidos no relatório.",
    },
    REPORT_NOT_FOUND: { status: 404, message: "Relatório não encontrado." },
    FORBIDDEN_ACTION: {
      status: 403,
      message: "Você não tem permissão para modificar este relatório.",
    },
    EMPTY_REPORT: { status: 400, message: "O relatório não pode estar vazio." },
    INVALID_DATE_RANGE: {
      status: 400,
      message: "O intervalo de datas informado é inválido.",
    },
    SERVER_ERROR: {
      status: 500,
      message: "Erro interno ao processar o relatório.",
    },
    TOO_MANY_REQUESTS: {
      status: 429,
      message: "Muitas solicitações seguidas. Tente novamente mais tarde.",
    },
  },

  general: {
    INTERNAL_SERVER_ERROR: {
      status: 500,
      message: "Erro interno do servidor.",
    },
    BAD_REQUEST: { status: 400, message: "Requisição mal formatada." },
    NOT_FOUND: { status: 404, message: "Recurso não encontrado." },
    METHOD_NOT_ALLOWED: {
      status: 405,
      message: "Método não permitido nesta rota.",
    },
  },
};

export default errors;
