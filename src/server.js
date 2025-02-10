//код стосовно сервера

import express from 'express'; //бібліотека для сворення серверу та роутингу
import pino from 'pino-http'; //логування
import cors from 'cors'; //безпека

import { getEnv } from './utils/getEnv.js'; //значення порта зі змінної оточення
import { ENV_VARS } from './constants/env.js'; //PORT
// import { StudentCollection } from './db/models/students.js'; //shema student
import { getStudentById, getStudents } from './db/services /students.js';

//огорне все що відбувалось
export const startServer = () => {
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

  //------
  //вказуємо метод і шлях (де обробляється цей метод)
  //app.use - для загальний midlewar, з route

  // app.get('/hello', (req, res, next) => {
  //   //res.send('Hello Express_1');
  //   next(new Error('error')); // перескоче там де буде аргумент err
  // });
  // app.get('/hello', (req, res, next) => {
  //   res.json({ message: 'Hello Express_2' });
  // });

  // app.get('/hello', (err, req, res, next) => {
  //   res.send(err.message);
  // });
  //--------

  //дістаємо дані з бекенду. для цього потрібна певна модель, схема
  app.get('/students', async (req, res) => {
    const students = await getStudents();
    res.json(students); //дані students. перевірка в postmen
  });
  //:studentId - : динамічна частина
  app.get('/students/:studentId', async (req, res) => {
    const studentId = req.params.studentId; //деструктирізація -   const {studentId} = req.params
    const student = await getStudentById(studentId);

    if (!student) {
      //щоб відпрацювало один раз return
      return res.status(404).json({
        status: 404,
        message: `Student with id ${studentId} not found`,
      });
    }
    res.json(student); //дані students. перевірка в postmen
  });

  //імпортуємо порт
  //const PORT = getEnv('PORT', 3001); //'PORT' - створемо об'єктом через constants
  const PORT = getEnv(ENV_VARS.PORT, 3000);
  app.listen(PORT, () => {
    //console.log(process.env);
    // console.log(process.env.PORT); //змінні оточення
    console.log(`Serverrr is running on port ${PORT}`);
  });
};
