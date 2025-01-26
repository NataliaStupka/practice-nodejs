//Ruters

import { Router } from 'express'; //для створення об'єкта роутера router
import {
  getStudentsByIdController, //пошук студента по id
  getStudentsController, //всі студенти
  createStudentController, //створення студента
  deleteStudentController, //видалення студента по id
  upsertStudentController, //PUT
  patchStudentController, //PATCH
} from '../controllers/students.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js'; //обгортка try/catch

const router = Router();

router.get('/students', ctrlWrapper(getStudentsController));
router.get('/students/:studentId', ctrlWrapper(getStudentsByIdController));

//POST
router.post('/students', ctrlWrapper(createStudentController));

//DELETE
router.delete('/students/:studentId', ctrlWrapper(deleteStudentController));

//PUT - оновлює весь ресурс
router.put('/students/:studentId', ctrlWrapper(upsertStudentController));

//PATCH
router.patch('/students/:studentId', ctrlWrapper(patchStudentController));

export default router;
