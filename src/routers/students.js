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
//Валідація
import { validateBody } from '../middlewares/validateBody.js'; //'обгортка'
import {
  createStudentValidationSchema,
  updateStudentValidationSchema,
} from '../validation/students.js'; //схема
import { validateMongoId } from '../middlewares/validateMongoId.js'; //валідація id

const studentsRouter = Router();

studentsRouter.use('/:studentId', validateMongoId('studentId')); //відпрацює скрізь де є шлях :studentId

//GET
studentsRouter.get('/', ctrlWrapper(getStudentsController));
studentsRouter.get('/:studentId', ctrlWrapper(getStudentsByIdController));

//POST
studentsRouter.post(
  '/',
  validateBody(createStudentValidationSchema), //валідація
  ctrlWrapper(createStudentController),
);

//PUT - оновлює весь ресурс (має отримати всю інформацію для створення/оновлення)
studentsRouter.put(
  '/:studentId',
  validateBody(createStudentValidationSchema), //валідація
  ctrlWrapper(upsertStudentController),
);

//PATCH - update
studentsRouter.patch(
  '/:studentId',
  validateBody(updateStudentValidationSchema),
  ctrlWrapper(patchStudentController),
);

//DELETE
studentsRouter.delete('/:studentId', ctrlWrapper(deleteStudentController));

export default studentsRouter;
