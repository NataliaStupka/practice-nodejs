//створення користувача: Register/Login/Refresh/Logout, SESSION;

import createHttpError from 'http-errors';
import bcrypt from 'bcrypt';
import { randomBytes } from 'crypto'; //Генерація випадкових токенів

import { UserCollection } from '../db/models/user.js'; //userSchema
//session
import { SessionCollection } from '../db/models/session.js'; //sessionSchema
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../constants/time-token.js';

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
