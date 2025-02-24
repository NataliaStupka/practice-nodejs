import {
  registerUser,
  loginUser,
  logoutUser,
  refreshSession,
} from '../services/auth.js'; //створенний користувач
import { serializeUser } from '../utils/serializeUser.js'; ////схема об'єкту, що повертаємо при response.json

import { REFRESH_TOKEN } from '../constants/time-token.js'; //30 days

//налаштування cookies
const setupSessionCookies = (session, res) => {
  console.log('SESSION-auth-Controller:', session);

  //cookie(name, value, options)
  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true, //доступний тільки через HTTP-запити
    expires: new Date(Date.now() + REFRESH_TOKEN), //термін дії 30 днів
  });
  res.cookie('sessionId', session._id, {
    httpOnly: true,
    expires: new Date(Date.now() + REFRESH_TOKEN),
  });
};

//REGISTER
export const registerUserController = async (req, res) => {
  const user = await registerUser(req.body);
  console.log('BODY_controller-register??:', req.body);
  console.log('USER_controller-register??:', user);

  res.status(200).json({
    status: 200,
    message: 'Successfully registered a user! 💗',
    data: serializeUser(user), //виводимо відповідь не показуючи пароль
  });
};

//вхід за токеном
//LOGIN   //виконує процес аутентифікації і повертає об'єкт сесії
export const loginUserController = async (req, res) => {
  console.log('LOGIN-controller_REQ-body:', req.body);

  const session = await loginUser(req.body); // req.body - email, password
  console.log('SESSION', session);

  setupSessionCookies(session, res); //налаштування cookies
  console.log(`Controllers-auth_setupSessionCookies_ RES: ${res})`);

  res.status(200).json({
    status: 200,
    message: 'Successfully loged in an user! 🟢',
    //data: session, //повертаємо без поля password -  serializeUser(session)
    data: { accessToken: session.accessToken },
  });
};

//REFRESH-SESSION
export const refreshSessionController = async (req, res) => {
  console.log(
    `Controller-auth_req: ${req}; res: ${res}, cookies!!: ${req.cookies}`,
  );

  const session = await refreshSession({
    //з cookies беремо sessionId, refreshToken
    sessionId: req.cookies.sessionId,
    refreshToken: req.cookies.refreshToken,
  });
  console.log('Controller-auth_session', session);

  setupSessionCookies(session, res); //налаштування cookies

  //повертаємо response з новим token
  res.status(200).json({
    status: 200,
    message: 'Successfully refreshed a session! 👌',
    //data: session, //повертаємо без поля password -  serializeUser(session)
    data: {
      accessToken: session.accessToken,
    },
  });
};

//LOGOUT
export const logoutUserController = async (req, res) => {
  console.log('logout-controller', req.cookies);
  if (req.cookies.sessionId) {
    //видаляє сесію user
    await logoutUser(req.cookies.sessionId);
  }

  //очищення куків, вихід user з системи на стороні клієнта
  res.clearCookie('sessionId');
  res.clearCookie('refreshToken');

  res.status(204).send(); // 204 (No Content)
};
