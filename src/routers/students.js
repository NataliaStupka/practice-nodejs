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
//authenticate
import { authenticate } from '../middlewares/authenticate.js';
//authorization
import { checkRoles } from '../middlewares/checkRoles.js';
import { ROLES } from '../constants/role.js';

const studentsRouter = Router();

studentsRouter.use('/', authenticate); //аунтефікація (без авторизації)
studentsRouter.use('/:studentId', validateMongoId('studentId')); //відпрацює скрізь де є шлях :studentId

//GET
studentsRouter.get(
  '/',
  checkRoles(ROLES.TEACHER, ROLES.PARENT), //ROLES.PARENT - delete!!
  ctrlWrapper(getStudentsController),
);
studentsRouter.get(
  '/:studentId',
  checkRoles(ROLES.TEACHER, ROLES.PARENT),
  ctrlWrapper(getStudentsByIdController),
);

//POST
studentsRouter.post(
  '/',
  checkRoles(ROLES.TEACHER, ROLES.PARENT),
  validateBody(createStudentValidationSchema), //валідація
  ctrlWrapper(createStudentController),
);

//PATCH - update
studentsRouter.patch(
  '/:studentId',
  checkRoles(ROLES.PARENT),
  validateBody(updateStudentValidationSchema),
  ctrlWrapper(patchStudentController),
);

//PUT - оновлює весь ресурс (має отримати всю інформацію для створення/оновлення)
studentsRouter.put(
  '/:studentId',
  checkRoles(ROLES.TEACHER, ROLES.PARENT),
  validateBody(createStudentValidationSchema), //валідація
  ctrlWrapper(upsertStudentController),
);

//DELETE
studentsRouter.delete(
  '/:studentId',
  checkRoles(ROLES.TEACHER),
  ctrlWrapper(deleteStudentController),
);

export default studentsRouter;
