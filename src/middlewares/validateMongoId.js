//перевіряти правильність id(ідентифікаторів), переданих у параметрах запиту

import { isValidObjectId } from 'mongoose';
import createHttpError from 'http-errors';

export const validateMongoId =
  (name = 'id') =>
  (req, res, next) => {
    const { studentId } = req.params;
    //якщо не валідний
    if (!isValidObjectId(studentId)) {
      throw createHttpError(400, `${name} is not a valid MongoId`);
    }
    next();
  };
//isValidId застосувати її в усіх роутах, які працюють з id студента
