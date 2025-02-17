//код middleware обробки помилок із server.js

//Імпортуємо клас HttpError для обробки помилок HTTP
import { isHttpError } from 'http-errors'; //клас HttpError для обробки помилок HTTP
import { MongooseError } from 'mongoose';

export const errorHandler = (err, req, res, next) => {
  // Перевірка, чи отримали ми помилку від createHttpError (404)
  if (isHttpError(err)) {
    return res.status(err.status).json({
      status: err.status,
      message: err.message,
      name: err.name,
    });
  }

  if (err instanceof MongooseError) {
    return res.status(500).json({
      status: 500,
      message: err.message,
      name: 'Mongoose error',
    });
  }

  if (err.isJoi) {
    return res.status(400).json({
      status: 400,
      message: err.message,
      errors: err.details.map((err) => ({
        message: err.message,
        path: err.path,
      })),
      name: 'Validation error',
    });
  }

  res.status(500).json({
    status: 500,
    message: err.message,
    name: 'Internal server error',
  });
};
