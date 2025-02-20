<!-- 6 module -->

    <!-- 6 email-and-images ==========================================-->

Для роботи з поштою протоколи(альтернативи для HTTP).
Найпоширенішими: SMTP(з одного сервера на інший в мережі Інтернет) та POP3(з поштового сервера на локальний комп'ютер користувача.).
під час передачі даних може використовуватись шифрування TLS або SSL. (аналог HTTPS для HTTP).

    🟠 Бібліотека **nodemailer** - функціонал надсилання листів.
    npm install nodemailer
    🟠 бібліотека для роботи із JWT - jsonwebtoken (npm i jsonwebtoken)

1.  скидання паролю: ивкористовуємо jwt-токен
    JWT (JSON Web Token) складається з трьох частин: Header(тип токена, алгоритм шифрування), Payload(корисна інформація) та Signature.
    header.payload.signature

    ✅ Shema (validation/auth) - services/auth - controllers/auth - routers/auth; const, env, utils/sendMail.js

    - нові константи та env змінні;
    - Функціонал надсилання листів в окрему функцію utils/sendMail.js
    - ендпоінту для надсилання листа з посиланням на скид пароля(routers/auth):
      - POST /auth/request-reset-email
      - POST /reset-password

    🟠 https://app.brevo.com/ - сайт створення емейлу для відсилання листа (розділ: SMTP & API, Senders, Domains & Dedicated IPs)

2.  **handlebars** Шаблонізатор для створення листів https://handlebarsjs.com/
    🟠 npm i handlebars

    - src/templates/reset-password-email.html

3.  зміна паролю - встановлення нового паролю використовуючи токен, що приходить користувачу на пошту:
    - src/validation/auth.js
    - src/services/auth.js
    - src/controllers/auth.js
    - src/routers/auth.js

<!-- 5 module -->

            <!-- 5 module-auth ==========================================-->

Аутентифікація в нашому додатку побудована на основі сесій

1.  USER(register):

    - TOKEN in const;
    - (models/user.js) - створюємо сутність user;
    - (validation/registerUser.js) - validation;
    - створення:
      - SERVICES/auth.js:
        - register (первірка чи вільний email, хешування паролю npm i bcrypt) ;
        - login
        - refresh
        - logout
      - CONTROLLER/auth (register);
      - ROUTERS/auth.js - authRouter;
      - validation/registerUser.js;

2.  - LOGIN, SESSION:
    - (models/session.js) - sessionSchema
    - SERVICES/auth.js:
      - login (перевірили чи зареєстрований юзер, чи відповідає введений пароль зареєстрованому, видалили стару сесію/створили нову сесію);
    - CONTROLLER/auth
    - ROUTERS/auth.js
    - validation/loginUser

- cookies
  Для роботи із куками **npm i cookie-parser**;
  та використати його як middleware в src/server.js
  метод .cookie

3.  REFRESH
    стару сесію видалити, нову створити, якщо токен вже просрочений то відправити на логінізацію
    - controller
    - router
4.  LOGOUT - очищаємо cookies (лише сервер може це зробити, оскільки вони httpOnly), а також видалити сесію із бази даних:
    - services/auth.js;
    - controllers/auth.js
      res.clearCookie - очищає кукі
    - routers/auth.js;
5.  аутентифікація

    - src/middlewares/authenticate.js;
    - в /routers/**students**.js використовуємо middleware authenticate;

- в **Postman**: auth/login (беремо токен) - contact/get_all (в хедер Bearer 'вставляемо токен' ) = отримуємо контакти;
  Authorization - Bearer 'token'(той що при auth/login) (postman/header на get запиті)
  \*. Налаштування вставлення токену в get запит в postman: login/Scripts:

  //
  const jsonData = pm.response.json();
  pm.environment.set('access_token', jsonData.data.accessToken)
  //
  Environment, Local - Variable: access_token;
  Colections/getContact/Auth - AuthType (BearerToken), Token ({{access_token}})

  //--------

6.  АвторизаціяЖ

    - src/validation/students.js
      до існуючих схем validation/students.js-(createStudentSchema), db/models/student.js -(studentsSchema) додати поле parentId;
    - constant ROLES
    - src/db/models/user.js додаємо role
    - middleware checkRoles;
    - src/routers/students.js використовуємо middleware checkRoles:
      - studentsRouter.get - корегуємо
      - controllers/student post - додаємо parentId (приналежність контакта юзеру)

7.  - teacher мають повний доступ до всіх контактів
    - parent - доступ тільки до свого контакту

      <!-- 4 module -->

          <!-- 4 module-validation-and-pagination ============================================-->

<!-- node_modules/joi/lib - index.d.ts -->

1.  Validation - перевіряємо що прийшло:
    Joi - бібліотека для валідації даних в JavaScript-середовищі, зокрема в Node.js (також підходить Formik, Yup, та інші)
    методи Joi.object() та Joi.array()

    для перевірки об'єктів даних на відповідність цій схемі.
    методи валідації: **validate** або **validateAsync**
    метод .messages({'string.base': ''})

    { abortEarly: false } при виклику методу validate, щоб отримати всі можливі помилки валідації, а не першу з них

        npm i joi

        - схема валідації через joi () - створення/оновлення(put, patch) об'єкту
          // src/validation/contact.js

        - Middleware - валідація для роутів
          // src/middlewares/validateBody.js

          - validateBody(схема) - повертає middleware для валідації body запиту;
          - isValidId - застосувати її в усіх роутах, які працюють з id студента

        - додати у роути валідацію
          // src/routers/students.js

    <!--  -->

2.  Пагінація:
    2.1. Створення:

        - логіка парсингу параметрів пошуку (page, perPage)
          // src/utils/parsePaginationParams.js
        - page, perPage додати в getStudentsController
          // src/controllers/students.js
        - calculatePaginationData - повертає об'єкт з повною інформацією про пагінацію
          // src/utils/calculatePaginationData.js
        - додати до сервісу логіку для того, щоб правильно запитувати дані з бази даних
          // src/.../services/students.js

    - .limit() - скільки хочемо повернути;
    - .skip() - скільки пропустити/відступити

3.  Сортування (utils - controllers - services): sort() в Mongoose:
    acs ↑, desc ↓

    - .sort()
      Model.find().sort({ field1: direction1, field2: direction2, ... });

    sortBy - по чому, sortOrder - порядок (ascendants)↑, (descendants)↓

4.  Filter (utils - controllers - services):
    Оператори порівняння в Mongoose:
    - $eq = значення поля дорівнює заданому значенню;
    - $ne != не дорівнює заданому значенню;
    - $gt > поля більше заданого значення;
    - $gte >= поля більше або дорівнює заданому значенню;
    - $lt <
    - $lte <= наприклад: ({ $lte: 8.5 });
    - $in ({ $in: ['male', 'female'] }) поля знаходиться в заданому масиві значень;
    - $nin поля не знаходиться в заданому масиві значень ({ gender: { $nin: ['male'] } })

Приклад запиту MongoDB для фільтрації у NoSQL базі даних:
db.students.find({ averageGrade: { $gte: 10 } });

SQL-запитів:
**Query Builder**
await StudentModel.find().where('age').gte(6).lte(10)

<!-- 3 module -->

    <!-- 3 module ============================================-->

<!-- рефакторінг(організація) -->
<!-- routers, controllers, обробка err, try/catch для запитів, middleware, http-errors -->

1.  src/routers
    розбиття роутів на логічні частини. (**Router**) — це об'єкт, який дозволяє групувати маршрути та їх обробники (middleware) у логічні групи.

    import { Router } from 'express';

    - створюємо папку src/routers;
    - переносимо контролери, які обробляють маршрути /students та /students/:studentId із файла server.js;
    - імпортуємо створений роутер у файл server.js та додаємо його як middleware до app, за допомогою методу app.use().

2.  src/controllers

    - винесемо контролери, з файлу-роутингу src/routes/students.js;
    - використовуємо котролери у роуті

3.  обробка помилок
4.  **next** - після виклику next обов’язково потрібно додати return, щоб у разі помилки припинити виконання подальшого коду у контролері.

5.  огорнути в src/routers функцією-обгорткою ctrlWrapper (try - catch)
    Будь-який **запит** у базу даних обгорнути у
    try {} catch() {}

    - у папці src/utils файл ctrlWrapper.js
    - Створити допоміжну функцію-обгортку для всих запитів (уникаємо повторення коду)

6.  Організація **middleware** - виносимо в окремі файли src/middlewares/

    - errorHandler.js //status(500)
    - notFoundHandler.js //status(404)
    - імпортуємо в server

7.  ПОМИЛКА пошуку студента за id (коректніше повертати помилку зі статусом 404 - Not Found)
    Інсталюємо пакетом **http-errors**, використовуємо у файлі контролера
    npm install http-errors

    - src/controllers/students.js; //Створюємо та налаштовуємо помилку throw createHttpError
    - src/middlewares/errorHandler.js

    <!-- Запити, POST, PUT, PATCH, DELETE -->

8.  Обробка тіла запиту
    у файлі server.js:
    ////
    import express from 'express';
    const app = express();
    app.use(express.json()) /Express буде автоматично парсити тіло запиту і поміщати його в req.body, при Content-Type: application/json
    ///

    Для типу application/vnd.api+json:
    app.use(express.json({
    type: ['application/json', 'application/vnd.api+json'],
    limit: '', //можна додати (обмежує розмір тіла запиту)
    }))

<!-- POST -->

9.  POST/students
    **controllers - routers - services**
    Для створення нового документа в колекції використовується метод: Model.create(doc).

             doc — перший аргумент (обов’язковий), який містить дані (об'єкт або масив об'єктів)

    <!-- DELETE -->

10. DELETE /students/:studentId
    **controllers - routers - services**
    Для видалення документа з колекції в Mongoose використовується метод:
    findOneAndDelete(filter, options, callback)

    - filter - вказує на умову, за якою відбувається пошук документа для видалення. Передається як об’єкт з властивостями. Обов'язковий аргумент;
    - options - додаткові властивості;
    - callback - якщо не використовується async/await, можна передати функцію зворотного виклику для обробки результату операції. Необов'язковий аргумент.

        <!-- PUT оновлює весь ресурс -->

11. PUT /students/:studentId
    **controllers - routers - services**
    //метод: Model.findOneAndUpdate(query, update, options, callback) Для оновлення документа в колекції

    - query - (обов’язковий) містить умови пошуку документа
    - update - (обов’язковий) містить дані для оновлення
    - options - (обов'язковий) об’єкт додаткових налаштувань (може бути порожнім {})
    - callback - (необов’язковий) функція зворотного виклику для обробки результату

    - new: повертає оновлений документ, якщо true
    - upsert: створює новий документ, якщо відповідний не знайдено

<!-- PATCH оновлює частину ресурсу -->

12. PATCH /students/:studentId
    **controllers - routers - services**

<!-- ----------------------------------- -->
<!-- ----------------------------------- -->
<!-- 2 module -->

    <!-- 2 module ============================================-->

**2 module**
// node --version
// node src/index.js
//нова гілка git checkout -b name

Налаштування:

1. **npm init -y** //ініціалізуємо проект;
2. в package.json: "type": "module",
3. **eslint** //Лінтінг коду відповідно до стандарту:
   npm init @eslint/config@latest;
   //
   ✔ How would you like to use ESLint? · problems
   ✔ What type of modules does your project use? · esm
   ✔ Which framework does your project use? · none
   ✔ Does your project use TypeScript? · javascript
   ✔ Where does your code run? · node
   npm
4. **.editorconfig** //послідовні стилі форматування коду в різних редакторах і середовищах;
5. **.gitignore**;
6. **.prettierrc**;
7. ????? eslint.config.mjs (.js/.cjs) ЧИ ЗМІНЮВАТИ ЯК У КОНСПЕКТІ ?;
8. **nodemon** як залежність:
   npm install --save-dev nodemon //автоматично перезапускає сервер після змін;
   скрипт у package.json:
   "scripts": {
   "dev": "nodemon src/index.js"
   };
   запускає додаток командою npm run dev

   //можна додати nodemon config ignore file в package.json або в окремий файл nodemon.json - вказуємо при зміні яких файлів перезавантажуватись не протрібно

9. папка src ->

   - index.js
   - файл server.js //логіка роботи express-серверу;

<!-- Express -->

10. npm install express (**Express** - обробка запитів, роутінг(визначення маршрутів), middleware, сервіси статичних файлів, ...):
    import express from 'express';
    const app = express(); //Ініціалізація Express-додаток (сервер);
    10.1. запуск сервера - метод сервера listen
11. **middleware** (наприклад для обробки запитів без маршруту, помилки). метод use
    app.use(paths, middleware) //шлях, middleware
12. middleware з бібліотеки **pino** - налаштовувати логгер через об’єкт властивостей.
    npm install pino-http //логер
    npm i --save-dev pino-pretty //форматування логів, в 'зрозумілому' вигляді

    import pino from 'pino-http'; //логування

    <!-- CORS тільки для браузера-->

13. **CORS** - інструмент безпеки для веб-додатків. Налаштовуємо відповідні HTTP-заголовки, які вказують, яким джерелам дозволено отримувати доступ.
    npm i cors // встановлює пакет cors
    import cors from 'cors';
    app.use(cors());

    <!-- Змінні отчення -->

14. Змінні отчення **.env** - зберігання конфігураційних параметрів, схованих ключів, шляхів до файлів, налаштувань серверів та іншої конфіденційної інформації.
    !!!! .env одразу доданий в .gitignore
    13.1. .env.example - містить всі необхідні назви змінних оточення без реальних значень
15. npm install dotenv - зчитувати та використовувати змінні оточення в додатку;
    import 'dotenv/config'; //зчитування змінних оточення
    або dotenv.config();

    15.1. Для доступу до змінних оточення в середовищі Node.js використовується глобальний об'єкт **process.env** (глобальна змінна, взаємодіє з процесом в якому є поточний додаток)

16. при відсутності змінної оточення, створити утилітарну функцію яка перевірятиме її наявність і генеруватиме помилку, якщо змінна не встановлена:
    src/utils/getEnvVar.js:
    import 'dotenv/config'; //зчитування змінних оточення
    або dotenv.config();
    ...
    export function getEnvVar(name, defaultValue) {
    const envVar = process.env[name];
    ...
    }

<!-- MongoDB -->

- нова папка src/db;

17. в .env, .env.example оформити **connection string**

18. **Mongoose** — це бібліотека для роботи з MongoDB у середовищі Node.js.
    моделювання та валідації даних для MongoDB:

        npm install mongoose
        // src/db/initMongoDB.js
        import mongoose from 'mongoose';

19. cтворили кластер в **MongoDB Atlas**:
    - NetworkAcces;
    - Database Access - користувач який має доступ;
    - Clusters -> Connect -> Compass (Copy the connection string ). вставляємо в MongoDb Compass
20. //встановлюємо **MongoDB Compass**
    Імпорт даних в MongoDB.
    Mongo Compass - графічний інтерфейс для роботи з MongoDB (взаємодія з базою даних);
    - Connections + -> вставляємо в URI (з паролем)
    - Authenion -> пароль
    - Save & Conect
21. MongoDB Compass створюємо базу даних;
    - Cluster + -> Database Name, Collection Name
    - Add Data -> import JSON
22. Shema - для даних з беканду потрібно зробити Shema
23. все що стосується серверу виносимо в окрему папку

    <!--  -->

    - Файлова структура застосунку:
      - ✅ constants - константі значення нашого застосунку;
      - ✅ ✅ controllers - контролери;
      - ✅ db - усе, що повʼязане із базою;
      - ✅ ✅ middlewares - кастомні мідлвари
      - ✅ ✅ routers - express-роутери, які будуть використані в застосунку
      - ✅ services - основне місце, де ми будемо прописувати логіку
      - templates - шаблони для email
      - ✅ utils - різні функції, які допомагатимуть нам робити певні перетворення чи маніпуляції
      - validation - валідаційні схеми
      - ✅ index.js - файл, з якого буде починатися виконання нашої програми
      - ✅ server.js - файл, де ми опишемо наш express-сервер

✅ - створено у 2 модулі
✅ ✅ - створено у 3 модулі

<!--  -->

Поширені значення хедеру Content-Type(запит):

    - text/plain - звичайний текст
    - ✅ application/json - дані у форматі JSON (для відправки POST, PUT та PATCH запитів)
    - application/xml - дані у форматі XML
    - ✅ multipart/form-data - для передачі файлів та даних форм (для завантаження файлів)
    - application/x-www-form-urlencoded - стандартна форма відправки даних у вебформах

Основні методи, які ми будемо використовувати:

    - GET: отримання інформації про ресурс (студента).
    - POST: створення нового ресурсу або виконання операції з існуючим.
    - PUT: повне оновлення існуючого ресурсу або створення нового.
    - PATCH: часткове оновлення існуючого ресурсу.
    - DELETE: видалення існуючого ресурсу.

<!--  -->

**Пагінація**, кілька загальних властивостей:

    - perPage - ліміт записів на сторінці. Кількість записів чи об'єктів, які повинні бути включені на кожній сторінці;
    - page - номер поточної сторінки, яку переглядає користувач;
    totalItems - загальна кількість записів чи об'єктів у всьому наборі даних;
    - totalPages - загальна кількість сторінок, яка визначається за формулою Math.ceil(totalItems / perPage);
    - hasPreviousPage - прапор, який вказує, чи є для поточного запиту попередня сторінка;
    - hasNextPage - прапор, який вказує, чи є для поточного запиту наступна сторінка.
