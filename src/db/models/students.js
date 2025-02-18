//схема користувача
//валідація на базі даних ?
import { model, Schema, Types } from 'mongoose';
import { GENDERS } from '../../constants/gender.js';
import { UserCollection } from './user.js';

const studentSchema = new Schema(
  {
    name: { type: String, required: true },
    age: { type: Number, required: true },
    gender: { type: String, required: true, enum: Object.values(GENDERS) },
    avgMark: { type: Number, required: true },
    onDuty: { type: Boolean, default: false, required: true },
    //
    //parentId: { type: Schema.Types.ObjectId, ref: 'users' },
    parentId: { type: Types.ObjectId, ref: UserCollection, required: true },
  },
  { timestamps: true, versionKey: false }, //timestamps автоматичне створення createdAt та updatedAt
);

// model - клас, з допомогою якого створюємо документи
export const StudentCollection = model('students', studentSchema);
// model(ім'я колекції, схема);
// createdAt (дата створення)
// updatedAt (дата оновлення)
