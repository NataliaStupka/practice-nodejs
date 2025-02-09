//код middleware обробки помилок із server.js

//Імпортуємо клас HttpError для обробки помилок HTTP
import { HttpError } from 'http-errors'; //клас HttpError для обробки помилок HTTP
import { Mongoose } from 'mongoose';

export const errorHandler = (err, req, res, next) => {
  // Перевірка, чи отримали ми помилку від createHttpError (404)
  if (err instanceof HttpError) {
    res.status(err.status).json({
      status: err.status,
      message: err.name,
      data: err,
    });
    return;
  }

  if (err instanceof Mongoose) {
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
    message: 'Something went wrong',
    error: err.message,
  });
};
