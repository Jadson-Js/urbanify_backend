const errorMiddleware = (err, req, res, next) => {
  res.status(err.statusCode || 500).json({
    error: err.name || "InternalServerError",
    message: err.message || "Ocorreu um erro no servidor",
  });
};

export default errorMiddleware;
