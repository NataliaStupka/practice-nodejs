import express from 'express'; //бібліотека для сворення серверу та роутингу
import pino from 'pino-http'; //логування
import cors from 'cors'; //безпека

import { getEnv } from './utils/getEnv.js'; //значення порта зі змінної оточення
import { ENV_VARS } from './constants/env.js'; //PORT

const app = express();

app.use(cors());
//cors як приклад. тут вказуємо, що можемо робити при запиті з браузером
// app.use(
//   cors({
//     methods: 'GET',
//     origin: 'localhost', //звідки виходимо на бекенд (робимо запити)
//   }),
// );

app.use(
  pino({
    transport: { target: 'pino-pretty' },
  }),
); //логування, в 'зрозумілому' вигляді pino-pretty

//вказуємо метод і шлях (де обробляється цей метод)
//app.use - для загальний midlewar, з route

// app.get('/hello', (req, res, next) => {
//   //res.send('Hello Express_1');
//   next(new Error('error')); // перескоче там де буде аргумент err
// });
app.get('/hello', (req, res, next) => {
  res.json({ message: 'Hello Express_2' });
});

app.get('/hello', (err, req, res, next) => {
  res.send(err.message);
});

//імпортуємо порт
//const PORT = getEnv('PORT', 3001); //'PORT' - створемо об'єктом через constants
const PORT = getEnv(ENV_VARS.PORT, 3000);
app.listen(PORT, () => {
  //console.log(process.env);
  // console.log(process.env.PORT); //змінні оточення
  console.log(`Serverrr is running on port ${PORT}`);
});
