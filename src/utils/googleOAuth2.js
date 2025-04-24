// генеруємо URL для аутентифікації користувача через Google OAuth 2.0.

import path from 'node:path'; //роботи з файлами та шляхами.
import { OAuth2Client } from 'google-auth-library';
import { readFile } from 'node:fs/promises'; //читання файлів з файлової системи.

import { getEnv } from './getEnv.js';
import { ENV_VARS } from '../constants/env.js';
import createHttpError from 'http-errors';

//шлях до googl-oauth.json.
const PATH_JSON = path.join(process.cwd(), 'google-oauth.json'); //з'єднує поточну директорію з ім'ям файлу googl-oauth.json,
console.log('-------- PATH_JSON ==', PATH_JSON);
//Читання конфігурації OAuth з JSON файлу
const oauthConfig = JSON.parse(await readFile(PATH_JSON)); //читає вміст

// новий єкземпляр клієнта для роботи з Google OAuth 2.0.
const googleOAuthClient = new OAuth2Client({
  // для ідентифікації додатка в системі Google.
  clientId: getEnv(ENV_VARS.GOOGLE_CLIENT_ID),
  clientSecret: getEnv(ENV_VARS.GOOGLE_CLIENT_SECRET),
  redirectUri: oauthConfig.web.redirect_uris[0], //URI, на який буде перенаправлено користувача після аутентифікації.
});

//генерування URL аутентифікації, за яким користувач може пройти аутентифікацію через Google, надавши дозволи.
export const generateAuthUrl = () =>
  googleOAuthClient.generateAuthUrl({
    //Дозвіл на доступ до електронної пошти користувача/ профілю користувача.
    scope: [
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/userinfo.profile',
    ],
  });
// console.log('---- googleOAuthClient ---:', googleOAuthClient);

//валідації того що приходить від користувача
export const validateCode = async (code) => {
  const response = await googleOAuthClient.getToken(code);
  if (!response.tokens.id_token) throw createHttpError(401, 'Unauthorized');

  const ticket = await googleOAuthClient.verifyIdToken({
    idToken: response.tokens.id_token,
  });
  console.log('-- ticket --', ticket);
  return ticket; //з цим можна дістати закодовані дані.
};

export const getFullNameFromGoogleTokenPayload = (payload) => {
  console.log('=== Payload_google-utils ==', payload);
  let fullName = 'Guest';
  // або створюємо користувача, або використовуємо вже існуючого
  //і логінимо використовуючи механізм вже створеної сессії
  if (payload.given_name && payload.family_name) {
    fullName = `${payload.given_name} ${payload.family_name}`;
  } else if (payload.given_name) {
    fullName = payload.given_name;
  }

  return fullName;
};
