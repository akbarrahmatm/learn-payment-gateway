const ApiError = require("../utils/ApiError");

module.exports = {
  onError(err, req, res, next) {
    err.statusCode = err.statusCode || 500;
    err.status = err.status;
    err.message = err.message;

    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      requestAt: req.requestTime,
    });
  },

  onLost(req, res, next) {
    next(new ApiError("Routes not found", 404));
  },
};
