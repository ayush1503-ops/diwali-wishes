/**
 * diwaliwish — centralized error handling
 *
 * AppError   : operational error class with statusCode
 * asyncHandler: wraps async route handlers so rejected promises reach next(err)
 * errorHandler : formats & sends the error response (express 4-arg handler)
 * notFound   : 404 for unmatched routes
 */

class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = String(statusCode).startsWith("4") ? "fail" : "error";
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

export { AppError };

export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  if (err.name === "CastError") {
    message = "Resource not found";
    statusCode = 404;
  }
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || "field";
    message = `Duplicate value for ${field}`;
    statusCode = 400;
  }
  if (err.name === "ValidationError") {
    message =
      Object.values(err.errors || {})
        .map((e) => e.message)
        .join(", ") || "Validation error";
    statusCode = 400;
  }
  if (err.name === "JsonWebTokenError") {
    message = "Invalid token";
    statusCode = 401;
  }
  if (err.name === "TokenExpiredError") {
    message = "Token expired";
    statusCode = 401;
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

export const notFound = (req, res, next) => {
  const err = new AppError(`Route not found - ${req.originalUrl}`, 404);
  next(err);
};
