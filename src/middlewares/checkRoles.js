import createHttpError from 'http-errors';
import { ROLES } from '../constants/role.js';
import { StudentCollection } from '../db/models/students.js'; //Schema

export const checkRoles =
  (...roles) =>
  //[]
  async (req, res, next) => {
    const { user } = req;
    try {
      //Якщо користувач відсутній
      if (!user) {
        next(createHttpError(401, 'User not found'));
        return;
      }

      const { role } = user;
      console.log(`------role: '${role}' with '${roles}'`);
      //якщо teacher - йдемо далі
      if (roles.includes(ROLES.TEACHER) && role === ROLES.TEACHER) {
        return next();
      }
      console.log(`user - ${req.user}, role - ${user.role}`);
      //якщо parents
      if (roles.includes(ROLES.PARENT) && role === ROLES.PARENT) {
        const { studentId } = req.params;

        if (!studentId) {
          return next();
        }
        //Пошук студента в базі даних за його ідентифікатором
        const student = await StudentCollection.findOne({ _id: studentId });
        //Перевірка батьківства, порівнюються ідентифікатор користувача (req.user._id) і parentId студента
        if (req.user._id.equals(student.parentId)) {
          return next();
        }
      }
      return next(createHttpError(403, 'Such action in unauthorized'));
    } catch (err) {
      next(err);
    }
  };
