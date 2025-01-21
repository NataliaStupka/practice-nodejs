import 'dotenv/config'; //зчитування змінних оточення

//наприклад, якщо змінна порта відсутня то буде по дефолту
export const getEnv = (envarName, defaultValue) => {
  const envVar = process.env[envarName];

  //якщо немає змінної оточення, є дефолтне значення
  if (!envarName && defaultValue) {
    return defaultValue;
  }
  //якщо немає змінної оточення
  if (!envVar) {
    throw new Error(`Env var with name ${envarName} not exist!`);
  }

  return envVar;
};
