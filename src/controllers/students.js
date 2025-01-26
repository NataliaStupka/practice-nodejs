//функції для обробки запитів

import {
  getStudents,
  getStudentById,
  createStudent,
  deleteStudent,
  updataStudent,
} from '../db/services /students.js';
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

//POST
export const createStudentController = async (req, res) => {
  const student = await createStudent(req.body);

  res.status(201).json({
    status: 201,
    message: `Successfully created a student!`,
    data: student,
  });
};

//DELETE
export const deleteStudentController = async (req, res, next) => {
  //ідентифікатор студента
  const { studentId } = req.params;

  const student = await deleteStudent(studentId);

  if (!student) {
    next(createHttpError(404, 'Student not found'));
    return;
  }

  res.status(204).send();
};

//PUT   upsert = update(оновити) + insert(вставити) - операцію в базах даних, яка вставляє новий запис, якщо він не існує, або оновлює існуючий запис, якщо він вже є.
export const upsertStudentController = async (req, res, next) => {
  const { studentId } = req.params;
  //upsert: створює новий документ, якщо відповідний не знайдено
  const result = await updataStudent(studentId, req.body, { upsert: true });

  if (!result) {
    next(createHttpError(404, 'Student not found'));
  }

  const status = result.isNew ? 201 : 202;

  res.status(status).json({
    status,
    message: `Successfully upserted a student!`,
    data: result.student,
  });
};

//PATCH
export const patchStudentController = async (req, res, next) => {
  const { studentId } = req.params;
  const result = await updataStudent(studentId, req.body);

  if (!result) {
    next(createHttpError(404, 'Student not found'));
    return;
  }

  res.json({
    status: 200,
    message: `Successfully patched a student!`,
    data: result.student,
  });
};
