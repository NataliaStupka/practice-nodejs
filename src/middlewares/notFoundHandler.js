//код middleware обробки помилок із server.js

export const notFoundHandler = (req, res, next) => {
  res.status(400).json({
    message: 'Route not found',
  });
};
