//схема користувача
//валідація на базі даних ?
import { model, Schema } from 'mongoose';
import { GENDERS } from '../../constants/gender.js';

const studentSchema = new Schema(
  {
    name: { type: String, required: true },
    age: { type: Number, required: true },
    gender: { type: String, required: true, enum: Object.values(GENDERS) },
    avgMark: { type: Number, required: true },
    onDuty: { type: Boolean, default: false, required: true },
  },
  { timestamps: true, versionKey: false },
);

// model - клас, з допомогою якого створюємо документи
export const StudentCollection = model('students', studentSchema);
// model(ім'я колекції, схема);
// createdAt (дата створення)
// updatedAt (дата оновлення)
