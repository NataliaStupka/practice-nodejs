//обробляє запит на аутентифікацію, перевіряє наявність і дійсність заголовка авторизації та токена доступу,
// шукає відповідну сесію та користувача,
// додає об'єкт користувача до запиту

import createHttpError from 'http-errors';
import { SessionCollection } from '../db/models/session.js';
import { UserCollection } from '../db/models/user.js';

//next - передає її до наступної функції
export const authenticate = async (req, res, next) => {
  const authHeader = req.get('Authorization'); //отримує заголовок авторизації
  console.log(`req - ${req}, authHeader - ${authHeader}`);

  try {
    //Перевірка заголовка авторизації
    if (!authHeader) {
      next(createHttpError(401, 'Please provide Authorization header 😊'));
      return;
    }

    const bearer = authHeader.split(' ')[0];
    const token = authHeader.split(' ')[1]; //отримуємо токен
    console.log('authHeader.split:', authHeader.split);

    //якщо тип заголовка не Bearer
    if (bearer !== 'Bearer') {
      throw new createHttpError(401, 'Auth header should be of type Bearer 🟠');
    }
    //якщо token відсутній(не прийшов)
    if (!token) {
      throw new createHttpError(401, 'No Access token provided! 🚫');
    }
    //Перевірка наявності сесії:
    const session = await SessionCollection.findOne({
      accessToken: token,
    });
    if (!session) {
      //якщо немає session
      throw new createHttpError(401, 'No active session found! 🚫');
    }
    //Перевірка терміну дії токена доступу
    if (session.accessTokenValidUntil < new Date()) {
      throw createHttpError(401, 'Session token expired! 👎');
    }
    //Пошук користувача:
    const user = await UserCollection.findById(session.userId);
    if (!user) {
      next(createHttpError(401, 'No user found for such session!'));
      return;
    }
    //додає об'єкт користувача до запиту
    req.user = user;
    console.log('midlewar-auth_user:', user);

    next(); //Викликається наступна функція
  } catch (err) {
    next(err);
  }
};
