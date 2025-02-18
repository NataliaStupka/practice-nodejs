//логіка      пагінація, фільтри і т.д

import { StudentCollection } from '../db/models/students.js'; //studentSchema
//pagination
import { calculatePaginationData } from '../utils/calculatePaginationData.js';
//
import { processStudentPayload } from '../utils/processPayload.js'; //при створені прийшли дані - об'єднали дещо в одне

//GET-all
export const getStudents = async ({
  page = 1,
  perPage = 10,
  sortBy = '_id',
  sortOrder = 'asc',
  filter = {},
}) => {
  const limit = perPage;
  //кількість контактів, що 'відступаємо' (offset)
  const skip = (page - 1) * perPage; //(поточна сторінка - 1)*кільк.на сторінці //offset

  const studentsQuery = StudentCollection.find();

  //filter
  if (filter.minAge) {
    studentsQuery.where('age').gte(filter.minAge);
  }
  if (filter.maxAge) {
    studentsQuery.where('age').lte(filter.maxAge);
  }
  if (filter.minAvgMark) {
    studentsQuery.where('avgMark').gte(filter.minAvgMark);
  }
  if (filter.maxAvgMark) {
    studentsQuery.where('avgMark').lte(filter.maxAvgMark);
  }
  if (filter.gender) {
    studentsQuery.where('gender').equals(filter.gender);
  }
  if (filter.onDute || filter.onDuty === false) {
    studentsQuery.where('onDute').equals(filter.onDute);
  }

  const studentsCount = await StudentCollection.find()
    .merge(studentsQuery) //об'єднання ??
    .countDocuments(); //повертає кількість документів, що відповідають умовам запиту в колекції

  const students = await studentsQuery
    //.merge(studentsQuery) //??????
    .skip(skip)
    .limit(limit)
    .sort({ [sortBy]: sortOrder })
    .exec();

  const paginationData = calculatePaginationData(studentsCount, perPage, page);

  //відповідь запиту
  return {
    data: students, //масив з даними контактів
    ...paginationData, //інформація про пагінацію
  };
};

//GET-by_id
export const getStudentById = async (studentId) => {
  const student = await StudentCollection.findById(studentId);
  return student;
};

// --- POST ---
//записує отримані дані (payload) у базу даних.
export const createStudent = async (payload) => {
  const student = await StudentCollection.create(
    processStudentPayload(payload),
  );
  return student;
};
//метод: Model.create(doc) Для створення нового документа

// {
//   "name": "John Doe",
//   "email": "jojndoe@mail.com",
//   "age": 10,
//   "gender": "male",
//   "avgMark": 10.3,
//   "onDuty": true
// }

// -- PUT, PATCH ---
//оновлює дані (payload) по ідентифікатору (studentId) в базі даних.
export const updataStudent = async (studentId, payload, options = {}) => {
  const rawResult = await StudentCollection.findByIdAndUpdate(
    { _id: studentId }, //studentId ???
    processStudentPayload(payload),
    {
      new: true,
      includeResultMetadata: true,
      ...options,
    },
  );

  if (!rawResult || !rawResult.value) return null;

  return {
    student: rawResult.value,
    isNew: Boolean(rawResult?.lastErrorObject?.upserted),
  };
};

// --- DELETE ----
export const deleteStudent = async (studentId) => {
  const student = await StudentCollection.findOneAndDelete({
    _id: studentId,
  });
  return student;
};

//метод: Model.findOneAndUpdate(query, update, options, callback) Для оновлення документа в колекції

//payload
// {
//   "name": "John Doe",
//   "email": "jojndoe@mail.com",
//   "age": 18,
//   "gender": "male",
//   "avgMark": 10.3,
//   "onDuty": true
// }
