//функції для обробки запитів

import {
  getStudents,
  getStudentById,
  createStudent,
  deleteStudent,
  updataStudent,
} from '../services/students.js';
import createHttpError from 'http-errors'; //для помилки пошуку студента за id
//pagination
import { parsePaginationParams } from '../utils/parsePaginationParams.js'; //page, perPage
//сортування
import { parseSortParams } from '../utils/parseSortParams.js';
//filter
import { parseFilters } from '../utils/parseFilterParams.js';
//зберігання фото
import { saveFileToUploadDir } from '../utils/saveFileToUploadDir.js';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinar.js';
import { getEnv } from '../utils/getEnv.js';
import { ENV_VARS } from '../constants/env.js';

//GET_all
export const getStudentsController = async (req, res) => {
  const { page, perPage } = parsePaginationParams(req.query); //pagination
  const { sortOrder, sortBy } = parseSortParams(req.query); //sort
  const filter = parseFilters(req.query); //gender, min/maxAge, min/maxAvgMark, onDuty

  const studentsWithPaginationMetadata = await getStudents({
    page,
    perPage,
    sortBy,
    sortOrder,
    filter,
  });

  res.json({
    status: 200,
    message: 'Successfully found students! 👍',
    data: studentsWithPaginationMetadata,
  });
};
//GET_by-id
export const getStudentsByIdController = async (req, res, next) => {
  const studentId = req.params.studentId;

  const student = await getStudentById(studentId);
  if (!student) {
    throw createHttpError(404, 'Student not found 🤷‍♂️'); //передаємо код помилки, рядок-опис
  }

  res.json({
    status: 200,
    message: `Successfully found student with id ${studentId}!`,
    data: student,
  });
};
//використовуємо котролери у роуті

//POST-create
export const createStudentController = async (req, res) => {
  const student = await createStudent({
    ...req.body,
    parentId: req.body.parentId ?? req.user._id,
  });
  console.log('REQ.QUERY_post:', req.body); //--
  console.log('student_post:', student); //--

  res.status(201).json({
    status: 201,
    message: `Successfully created a student! ❤️`,
    data: student,
  });
};

//PATCH
export const patchStudentController = async (req, res, next) => {
  const { studentId } = req.params;
  const photo = req.file; ////fieldname, path, originalname, filename, ...
  console.log('PHOT----', photo);
  console.log('================---', req.file);
  let photoUrl;

  //якщо прийшло фото - передали його у функцію, що збереже в локал папці
  const strategy = getEnv(ENV_VARS.SAVE_FILE_STRATEGY);
  if (photo) {
    if (strategy === 'cloudinary') {
      photoUrl = await saveFileToCloudinary(photo);
    }
    if (strategy === 'local') {
      photoUrl = await saveFileToUploadDir(photo);
    }
  }
  console.log('photoUrl -----', photoUrl);

  const result = await updataStudent(
    studentId,
    { ...req.body, photo: photoUrl },
    { upsert: false }, //??
  );
  console.log(
    `Patch-CONTROLLER_ req.params: ${req.params}, req.body: ${req.body}, result - ${result}`,
  );

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

//PUT   upsert = update(оновити) + insert(вставити) - операцію в базах даних, яка вставляє новий запис, якщо він не існує, або оновлює існуючий запис, якщо він вже є.
export const upsertStudentController = async (req, res, next) => {
  const { studentId } = req.params;
  //upsert: створює новий документ, якщо відповідний не знайдено
  const result = await updataStudent(studentId, req.body, { upsert: true });
  console.log('RESULT-PUT_controller:', result);

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
