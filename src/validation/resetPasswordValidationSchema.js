//встановлення нового паролю

import Joi from 'joi';

export const resetPasswordValidationSchema = Joi.object({
  password: Joi.string().required(),
  token: Joi.string().required(),
});
