// err is what happens before the request
// next is what happens after
const errorMiddleware = (err, req, res, next) => {
  try {
    let error = { ...err }; // made and error object

    error.message = err.message; // changing the message according to out need

    console.error(err);

    // Mongoose bad ObjectID error
    if (err.name === "CastError") {
      const message = "Resource not found";

      error = new Error(message);
      error.statusCode = 404;
    }

    // Mongoose duplicate key error
    if (err.code === 11000) {
      const message = "Duplicate field value entered";
      error = new Error(message);
      error.statusCode = 400;
    }

    // Mongoose Validation Error
    if (err.name === "ValidationError") {
      const message = Object.values(err.errors).map((val) => val.message);
      error = new Error(message.join(", "));
      error.statusCode = 400;
    }

    res
      .status(error.statusCode || 500)
      .json({ success: false, error: error.message || "Server Error" });
  } catch (error) {
    next(error);
  }
};

export default errorMiddleware;
