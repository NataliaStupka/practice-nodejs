//код стосовно сервера

import express from 'express'; //бібліотека для сворення серверу та роутингу
import pino from 'pino-http'; //логування
import cors from 'cors'; //безпека

import { getEnv } from './utils/getEnv.js'; //значення порта зі змінної оточення
import { ENV_VARS } from './constants/env.js'; //PORT

//Імпортуємо router
import studentsRouter from './routers/students.js'; //котролери маршрутів /students та /students/:studentId

// Імпортуємо middleware (помилки)
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { errorHandler } from './middlewares/errorHandler.js';

//огорне все що відбувалось
export const startServer = () => {
  const app = express();

  app.use(cors());

  app.use(
    pino({
      transport: { target: 'pino-pretty' },
    }),
  ); //логування, в 'зрозумілому' вигляді pino-pretty

  app.use(studentsRouter); // Додаємо роутер до app як middleware

  //помилки
  app.use('*', notFoundHandler); //status(404)
  app.use(errorHandler); //status(500)

  //імпортуємо порт
  //const PORT = getEnv('PORT', 3001); //'PORT' - створемо об'єктом через constants
  const PORT = getEnv(ENV_VARS.PORT, 3000);
  app.listen(PORT, () => {
    //console.log(process.env); // console.log(process.env.PORT); //змінні оточення
    console.log(`Serverrr is running on port ${PORT}`);
  });
};
