const errorHandler = (err, req, res, next) => {
  console.error("[Global Error Handler]:", err);

  const statusCode = err.statusCode || 500;
  const errorCode = err.code || "INTERNAL_SERVER_ERROR";

  res.status(statusCode).json({
    success: false,
    error: {
      code: errorCode,
      message: err.message || "An unexpected error occurred",
      details: process.env.NODE_ENV === "development" ? err.stack : undefined,
    },
  });
};

module.exports = errorHandler;
