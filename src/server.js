//логіка роботи express-серверу

import express from 'express'; //бібліотека для створення серверу та роутингу
import pino from 'pino-http'; //логування
import cors from 'cors'; //безпека

import { getEnv } from './utils/getEnv.js'; //значення порта зі змінної оточення
import { ENV_VARS } from './constants/env.js'; //PORT

//Імпортуємо router
import router from './routers/index.js'; //контролери маршрутів /students та /students/:studentId

// Імпортуємо middleware (помилки)
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { errorHandler } from './middlewares/errorHandler.js';
import cookieParser from 'cookie-parser';

// // // ‼️ ВИДАЛИТИ ПЕРЕД ДЕПЛОЄМ!! локально вимикає додаткові перевірки (для відправки листа при reset password) без цього відправляє але не доходить
// process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

//огорне все що відбувалось
export const startServer = () => {
  const app = express(); //Ініціалізувати Express-додаток

  //?????
  //вбудована middleware,
  app.use(express.json()); //Express буде автоматично парсити тіло запиту
  //  і поміщати його в req.body, при Content-Type: application/json

  app.use(cors());
  app.use(cookieParser());

  app.use(
    pino({
      transport: { target: 'pino-pretty' },
    }),
  ); //логування, в 'зрозумілому' вигляді pino-pretty

  app.use(router); // Додаємо роутер до app як middleware

  //помилки
  app.use('*', notFoundHandler); //status(404)
  app.use(errorHandler); //status(500)

  //імпортуємо порт
  //const PORT = getEnv('PORT', 3001); //'PORT' - створемо об'єктом через constants
  const PORT = getEnv(ENV_VARS.PORT, 4000);
  app.listen(PORT, () => {
    //console.log(process.env); // console.log(process.env.PORT); //змінні оточення
    console.log(`Server is running on port ${PORT}`);
  });
};
