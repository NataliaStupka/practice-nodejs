import { initMongoDBConnection } from './db/initMongoDbConnection.js';
import { startServer } from './server.js';

import { createDirIfNotExist } from './utils/createDirIfNotExist.js';
import { TEMP_DIR_PATH, UPLOADS_DIR_PATH } from './constants/path.js';

//при запуску додатку створює папку якщо її ще не існує
await createDirIfNotExist(TEMP_DIR_PATH);
await createDirIfNotExist(UPLOADS_DIR_PATH);

await initMongoDBConnection();
startServer();
