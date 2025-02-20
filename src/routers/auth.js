import { Router } from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js'; //обгортка try/catch
import { validateBody } from '../middlewares/validateBody.js'; //обгортка валідаці для роутів

import { registerUserSchema } from '../validation/registerUser.js'; //схема валідациї
import {
  registerUserController,
  loginUserController,
  refreshSessionController,
  logoutUserController,
  requestResetPasswordEmailController,
  resetPasswordController, //скидання пароля
} from '../controllers/auth.js'; //res.status(201).json();
import { loginUserValidationSchema } from '../validation/loginUserValidation.js';
//скид паролю
import { requestResetEmailSchema } from '../validation/requestResetPasswordEmailValidationSchema.js'; //скидання пароля: валідація email
import { resetPasswordValidationSchema } from '../validation/resetPasswordValidationSchema.js'; //встановлення нового паролю: валідація password, token

const authRouter = Router();

//REGISTER
authRouter.post(
  '/register',
  validateBody(registerUserSchema),
  ctrlWrapper(registerUserController),
);

//LOGIN
authRouter.post(
  '/login',
  validateBody(loginUserValidationSchema),
  ctrlWrapper(loginUserController),
);

//REFRESH-SESSION
authRouter.post('/refresh-session', ctrlWrapper(refreshSessionController));

//LOGOUT
authRouter.post('/logout', ctrlWrapper(logoutUserController));

//скидання пароля
authRouter.post(
  '/request-reset-password-email',
  validateBody(requestResetEmailSchema), //потрібен лише email
  ctrlWrapper(requestResetPasswordEmailController),
);
//встановлення нового паролю
authRouter.post(
  '/reset-password',
  validateBody(resetPasswordValidationSchema),
  ctrlWrapper(resetPasswordController),
);

export default authRouter;
