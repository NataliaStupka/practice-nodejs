import { Router } from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js'; //обгортка try/catch
import { validateBody } from '../middlewares/validateBody.js'; //обгортка валідаці для роутів

import { registerUserSchema } from '../validation/registerUser.js'; //схема валідациї
import {
  registerUserController,
  loginUserController,
  refreshSessionController,
  logoutUserController,
} from '../controllers/auth.js'; //res.status(201).json();
import { loginUserValidationSchema } from '../validation/loginUserValidation.js';

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

export default authRouter;
