//обробки завантаження файлів(фото) на сервер.

import multer from 'multer';
import { TEMP_DIR_PATH } from '../constants/path.js'; // src/temp;

//diskStorage - дозволяє зберігати файли більше розміром
const storage = multer.diskStorage({
  //визначення місця куди зберігаємо файли
  destination: function (req, file, cb) {
    console.log('FILE_multer:', file); //fieldname, originalname, encoding, mimetype
    cb(null, TEMP_DIR_PATH); //куди зберігаємо //null - якщо буде помилка, TEMP_DIR_PATH - якщо результат виконання
  },
  //як будуть називатися
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now();
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  },
});

export const upload = multer({ storage: storage });
