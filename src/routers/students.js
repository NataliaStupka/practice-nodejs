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

const router = Router();

router.use('/students/:studentId', validateMongoId('studentId')); //відпрацює скрізь де є шлях :studentId

router.get('/students', ctrlWrapper(getStudentsController));
router.get('/students/:studentId', ctrlWrapper(getStudentsByIdController));

//POST
router.post(
  '/students',
  validateBody(createStudentValidationSchema), //валідація
  ctrlWrapper(createStudentController),
);

//DELETE
router.delete('/students/:studentId', ctrlWrapper(deleteStudentController));

//PUT - оновлює весь ресурс (має отримати всю інформацію для створення/оновлення)
router.put(
  '/students/:studentId',
  validateBody(createStudentValidationSchema), //валідація
  ctrlWrapper(upsertStudentController),
);

//PATCH - update
router.patch(
  '/students/:studentId',
  validateBody(updateStudentValidationSchema),
  ctrlWrapper(patchStudentController),
);

export default router;
