//Схема валідації на вхідні дані

import Joi from 'joi';
import { GENDERS } from '../constants/gender.js';
import { isValidObjectId } from 'mongoose'; //для авторизації

//для об’єкта при створенні нового студента:
//string().required().min() і т.д - патерн builder
export const createStudentValidationSchema = Joi.object({
  firstName: Joi.string().required().min(1).max(20),
  secondName: Joi.string().required().min(1).max(20),
  email: Joi.string(),
  age: Joi.number().integer().min(6).max(50).required(),
  gender: Joi.string()
    .valid(...Object.values(GENDERS))
    .required(),
  avgMark: Joi.number().min(2).max(12).required(),
  onDuty: Joi.boolean(),

  //для авторизації (винести в окрему функцію)
  parentId: Joi.string().custom((value, helper) => {
    if (value && !isValidObjectId(value)) {
      return helper.message('Parent id should be a valid mongo id');
    }
    return true;
  }),
});

//для валідації об’єкта студента при його оновленні
export const updateStudentValidationSchema = Joi.object({
  ////name: Joi.string().min(3).max(30), //???
  firstName: Joi.string().min(1).max(20),
  secondName: Joi.when('firstName', {
    //умова, якщо у firstName є, то виконай then
    is: Joi.string().required(),
    then: Joi.string().required(),
  }),
  email: Joi.string().email(),
  age: Joi.number().integer().min(6).max(16),
  gender: Joi.string().valid('male', 'female', 'other'),
  avgMark: Joi.number().min(2).max(12),
  onDuty: Joi.boolean(),
});

// ---------------------------------------------------------
// {
//   "firstName": "Test",
//   "secondName": "First",
//   "email": "jojndoe@mail.com",
//   "age": 13,
//   "gender": "male",
//   "avgMark": 10.3,
//   "onDuty": true
// }
//
//   name: Joi.string().min(3).max(30).required().messages({
//     'string.base': 'Username should be a string', // Кастомізація повідомлення для типу "string"
//     'string.min': 'Username should have at least {#limit} characters',
//     'string.max': 'Username should have at most {#limit} characters',
//     'any.required': 'Username is required',
//   })
