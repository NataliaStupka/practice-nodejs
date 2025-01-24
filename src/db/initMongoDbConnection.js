// функцію initMongoDBConnection для встановлення зʼєднання
////  кластер( база даних) створена в mongodb

import mongoose from 'mongoose'; //бібліотека для роботи з MongoDB у Node.js
import { getEnv } from '../utils/getEnv.js';
import { ENV_VARS } from '../constants/env.js'; //змінні оточення

export const initMongoDBConnection = async () => {
  //mongoDB_Atlas -> Cluster -> Conect -> Drivers -> з node на mongoose -> 3.View full code sample
  try {
    //викор.змінні оточення
    const user = getEnv(ENV_VARS.MONGODB_USER);
    const password = getEnv(ENV_VARS.MONGODB_PASSWORD);
    const domain = getEnv(ENV_VARS.MONGODB_DOMAIN);
    const db = getEnv(ENV_VARS.MONGODB_DATABASE);

    const conectionURI = `mongodb+srv://${user}:${password}@${domain}/${db}?retryWrites=true&w=majority&appName=Cluster0`;

    await mongoose.connect(conectionURI);
    console.log('Conection successfully established!'); //'Підключення успішно встановлено!'
  } catch (err) {
    console.error('Conection issues:', err);
    //process - глобальна змінна взаємодія з процесом в якому є поточ.додаток
    process.exit(1); //закінчуємо процес і виходимо з кодом 1
    //якщо код 0, то це означає що додаток відпрацював коректно. якщо не з 0 - то щось пішло не  так.
  }
};
