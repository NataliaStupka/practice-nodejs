//функції для обробки запитів

import { getStudents, getStudentById } from '../db/services /students.js';
import createHttpError from 'http-errors'; //для помилки пошуку студента за id

export const getStudentsController = async (req, res) => {
  const students = await getStudents();

  res.json({
    status: 200,
    message: 'Successfully found students!',
    data: students,
  });
};

export const getStudentsByIdController = async (req, res, next) => {
  const studentId = req.params.studentId;
  const student = await getStudentById(studentId);

  ////// 1)якщо студента не знайдено: ///
  //   if (!student) {
  //     res.status(404).json({
  //       status: 404,
  //       message: `Student with id ${studentId} not found`,
  //     });
  //     return;
  //   }
  ////// 2)Базова обробка помилок //якщо поверне null викликаємо next з об'єктом помилки
  //   if (!student) {
  //     next(new Error('Student not found'));
  //     return;
  //   }
  //   //Після виклику next, обробник помилок в нашому додатку (error middleware)
  //   // у файлі server.js, перехопить і опрацює цю помилку.

  ////// 3) Створюємо та налаштовуємо помилку (використовуємо http-errors)
  if (!student) {
    throw createHttpError(404, 'Student not found'); //передаємо код помилки, рядок-опис
  }

  res.json({
    status: 200,
    message: `Successfully found student with id ${studentId}!`,
    data: student,
  });
};
//використовуємо котролери у роуті

//
// --- контролери ---
// //дістаємо дані з бекенду. для цього потрібна певна модель, схема
// router.get('/students', async (req, res) => {
//   const students = await getStudents();

//   //res.json(students); //дані students. перевірка в postmen
//   res.status(200).json({
//     data: students,
//   });
// });

// //:studentId - : динамічна частина
// router.get('/students/:studentId', async (req, res) => {
//   const studentId = req.params.studentId; //деструктирізація -   const {studentId} = req.params
//   const student = await getStudentById(studentId);

//   if (!student) {
//     //щоб відпрацювало один раз return
//     return res.status(404).json({
//       status: 404,
//       message: `Student with id ${studentId} not found`,
//     });
//   }

//   //res.json(student); //дані students. перевірка в postmen
//   res.status(200).json({
//     data: student,
//   });
// });
// ======
