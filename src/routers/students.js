//Ruters

import { Router } from 'express'; //для створення об'єкта роутера router
import {
  getStudentsByIdController,
  getStudentsController,
} from '../controllers/students.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js'; //обгортка try/catch

const router = Router();

router.get('/students', ctrlWrapper(getStudentsController));
router.get('/students/:studentId', ctrlWrapper(getStudentsByIdController));

export default router;
