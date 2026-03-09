class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.timestamp = new Date();
  }
}

const errorHandler = (err, req, res, next) => {
  console.error(`[ERROR] ${err.message}`);

  // Handle AppError
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      error: {
        message: err.message,
        statusCode: err.statusCode,
        timestamp: err.timestamp,
      },
    });
  }

  // Handle Mongoose validation errors
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      error: {
        message: 'Validation Error',
        details: Object.values(err.errors).map((e) => e.message),
      },
    });
  }

  // Handle Mongoose duplicate key error
  if (err.code === 11000) {
    return res.status(400).json({
      success: false,
      error: {
        message: 'Duplicate field value',
        field: Object.keys(err.keyPattern)[0],
      },
    });
  }

  // Default error response
  res.status(500).json({
    success: false,
    error: {
      message: err.message || 'Internal Server Error',
      statusCode: 500,
    },
  });
};

module.exports = {
  AppError,
  errorHandler,
};
