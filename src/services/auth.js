//створення користувача: Register/Login/Refresh/Logout, SESSION;

import createHttpError from 'http-errors';
import bcrypt from 'bcrypt';
import { randomBytes } from 'crypto'; //Генерація випадкових токенів

import { UserCollection } from '../db/models/user.js'; //userSchema
//session
import { SessionCollection } from '../db/models/session.js'; //sessionSchema
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../constants/time-token.js';
//скид паролю
import jwt from 'jsonwebtoken'; //для роботи із JWT-токеном
import Handlebars from 'handlebars'; //шаблон - library
import path from 'node:path'; //шлях
import fs from 'node:fs';
//
import { getEnv } from '../utils/getEnv.js'; //змінна оточення
import { sendEmail } from '../utils/sendEmail.js'; // надсилання листів
import { ENV_VARS } from '../constants/env.js'; //const змінна оточення
import { TEMPLATES_DIR_PATH } from '../constants/path.js'; //шляхи до різних файлів

//для скиду паролю
//читає файл та повертає його вміст за шляхом path
const resetEmailTemplate = fs
  .readFileSync(
    path.join(TEMPLATES_DIR_PATH, 'reset-password-email.html'), //шаблон html листа
  )
  .toString();

//для перевикористання: створення сесії
const createSession = () => ({
  //нові токени доступу та оновлення
  accessToken: randomBytes(30).toString('base64'), //рандомна
  refreshToken: randomBytes(30).toString('base64'),
  accessTokenValidUntil: new Date(Date.now() + ACCESS_TOKEN), //15 minutes
  refreshTokenValidUntil: new Date(Date.now() + REFRESH_TOKEN), //30 days
});

//REGISTER
export const registerUser = async ({ name, email, password }) => {
  //1 спосіб - перевіряємо базу даних, чи є юзер з таким емейлом
  let user = await UserCollection.findOne({ email: email });
  if (user) {
    throw createHttpError(409, 'Email in use! 🧐');
  }

  //хешування паролю npm i bcrypt
  const hashedPassword = await bcrypt.hash(password, 10); //10 - кількість дій(раундів)

  user = await UserCollection.create({ name, email, password: hashedPassword });

  return user;
  //     //2й спосіб //user з таким email вже зареєстрований
  //   try {
  //     const user = await UserCollection.create(payload);
  //     return user;
  //   } catch (err) {
  //     //номер помилки подивитися через дебагер
  //     if (err.code === 11000) {
  //       throw createHttpError(409, 'User alredy registred!');
  //     }
  //     throw err;
  //   }
};

//LOGIN (перевіряємо, створюємо сесію)
export const loginUser = async ({ email, password }) => {
  //перевіряємо базу, чи є юзер з таким емейлом
  const user = await UserCollection.findOne({ email: email });
  console.log('LOGIN-Serv_USER:', user);
  if (!user) {
    throw createHttpError(404, 'User not found! 🚫');
  }

  //знайшли користувача,
  // Порівнюємо хеші паролів, якщо не однакові то не логінемо
  const arePasswordEquel = await bcrypt.compare(password, user.password);
  if (!arePasswordEquel) {
    throw createHttpError(401, 'Login or password is incorrect! 🔴'); //якщо паролі не однакові
  }

  //видаляємо стару сесію для уникнення конфліктів з новою сесією.
  await SessionCollection.deleteOne({ userId: user.id });
  //створюємо нову session
  return await SessionCollection.create({
    userId: user._id,
    ...createSession(), //згенеровані токени доступу та оновлення, а також часові межі їхньої дії.
  });
};

//REFRESH-SESSION
export const refreshSession = async ({ sessionId, refreshToken }) => {
  console.log(
    `Services-refresh_req: sessionId - ${sessionId}, refreshToken - ${refreshToken}`,
  );

  //отримали сесію
  const session = await SessionCollection.findOne({
    //sessionId: req.cookies.sessionId,
    _id: sessionId,
    refreshToken,
  });
  console.log('services-auth_session:', session);

  //сесії не має
  if (!session) {
    throw createHttpError(401, 'Session not found! 🚫');
  }
  //чи token ще працюючий (якщо сесія 'протухла')
  if (session.refreshTokenValidUntil < new Date()) {
    throw createHttpError(401, 'Session token expired! 👎');
  }
  //
  const user = await UserCollection.findById(session.userId);
  if (!user) {
    throw createHttpError(401, 'Session user is not found! 🚫');
  }

  //delete old session
  await SessionCollection.findByIdAndDelete(session._id);

  //create new session
  const newSession = await SessionCollection.create({
    userId: session._id,
    ...createSession(), //згенеровані токени доступу та оновлення, а також часові межі їхньої дії.
  });

  return newSession;
};

//LOGOUT
export const logoutUser = async (sessionId) => {
  console.log('services-LOGOUT_sessionId:', sessionId);
  await SessionCollection.deleteOne({ _id: sessionId });
};

//СКИД ПАРОЛЮ
export const requestResetToken = async (email) => {
  const user = await UserCollection.findOne({ email });
  if (!user) {
    throw createHttpError(404, 'User not found! 🚫');
  }

  //токен скидання пароля // jwt - для роботи з токеном
  const token = jwt.sign(
    { sub: user._id, email }, //для кого генеруємо токен
    getEnv(ENV_VARS.JWT_SECRET), //для генерації підпису токену
    {
      expiresIn: '15m', //термін дії
    },
  );

  //шлях - посилання/назва?токен
  const resetPasswordLink = `${getEnv(
    ENV_VARS.FRONTEND_DOMAIN,
  )}/reset-password?token=${token}`;

  //шаблон
  const template = Handlebars.compile(resetEmailTemplate);
  const html = template({
    name: user.name,
    link: resetPasswordLink,
  });

  // sendEmail - надсилання листів
  await sendEmail({
    from: getEnv(ENV_VARS.SMTP_FROM),
    to: email,
    subject: 'Reset your password!',
    // html: `<p>Click <a href="${token}">here</a> to reset your password!</p>`,
    html,
  });
};

//ВСТАНОВЛЕННЯ НОВОГО ПАРОЛЮ
export const resetPassword = async (payload) => {
  let entries;
  console.log('Payload:', payload);
  //чи валідний токен, через jwt.verify
  try {
    entries = jwt.verify(payload.token, getEnv(ENV_VARS.JWT_SECRET));
  } catch (err) {
    if (err instanceof Error) throw createHttpError(401, err.message);
    throw err;
  }

  //чи є користувач //????findById
  const user = await UserCollection.findOne({
    email: entries.email,
    _id: entries.sub,
  });
  if (!user) {
    throw createHttpError(404, 'User not found! 🚫');
  }
  console.log('PAYPASSW:!!', payload.password);
  //хешуємо пароль
  const encryptedPassword = await bcrypt.hash(payload.password, 10);
  //замінюємо на ноий пароль, знаходимо користувача по id
  await UserCollection.findByIdAndUpdate(user._id, {
    password: encryptedPassword,
  });
};
