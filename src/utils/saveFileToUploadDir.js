import path from 'node:path';
import fs from 'node:fs/promises';
import { TEMP_DIR_PATH, UPLOADS_DIR_PATH } from '../constants/path.js';
import { getEnv } from './getEnv.js';
import { ENV_VARS } from '../constants/env.js';

export const saveFileToUploadDir = async (file) => {
  await fs.rename(
    path.join(TEMP_DIR_PATH, file.filename),
    path.join(UPLOADS_DIR_PATH, file.filename),
  );

  return `${getEnv(ENV_VARS.BACKEND_DOMAIN)}/uploads/${file.filename}`;
  //return `${getEnvVar('APP_DOMAIN')}/uploads/${file.filename}`;
};

///Users/nataliiastupka/Desktop/GoIt/Nodejs/test/practice-nodejs/src/templates/1740437479239-swan.jpeg'
// -> '/Users/nataliiastupka/Desktop/GoIt/Nodejs/test/practice-nodejs/uploads/1740437479239-swan.jpeg'",
