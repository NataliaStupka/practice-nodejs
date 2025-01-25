//код middleware обробки помилок із server.js

import { HttpError } from 'http-errors'; //клас HttpError для обробки помилок HTTP

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

  res.status(500).json({
    message: 'Something went wrong',
    error: err.message,
  });
};
