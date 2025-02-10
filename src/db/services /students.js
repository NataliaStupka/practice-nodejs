//логіка      пагінація, фільтри і т.д

import { StudentCollection } from '../models/students.js';

export const getStudents = async () => {
  const students = await StudentCollection.find();

  return students;
};

export const getStudentById = async (studentId) => {
  const student = await StudentCollection.findById(studentId);

  return student;
};

// --- POST ---
//записує отримані дані (payload) у базу даних.
export const createStudent = async (payload) => {
  const student = await StudentCollection.create(payload);

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

// --- DELETE ----
export const deleteStudent = async (studentId) => {
  const student = await StudentCollection.findOneAndDelete({
    _id: studentId,
  });
  return student;
};

// -- PUT, PATCH ---
//оновлює дані (payload) по ідентифікатору (studentId) в базі даних.
export const updataStudent = async (studentId, payload, options = {}) => {
  const rawResult = await StudentCollection.findOneAndUpdate(
    { _id: studentId },
    payload,
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

// --- PATCH ---
