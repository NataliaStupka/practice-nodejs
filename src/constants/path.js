//шляхи до різних файлів

import path from 'node:path';

// шлях до src/templates
export const TEMPLATES_DIR_PATH = path.join(process.cwd(), 'src', 'templates'); //шаблон html лдя листа request password

//зберігання картинок
export const TEMP_DIR_PATH = path.join(process.cwd(), 'temp'); // temp, - тимчасово
export const UPLOADS_DIR_PATH = path.join(process.cwd(), 'uploads'); // uploads,
