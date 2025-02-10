import { initMongoDBConnection } from './db/initMongoDbConnection.js';
import { startServer } from './server.js';

await initMongoDBConnection();
startServer();
