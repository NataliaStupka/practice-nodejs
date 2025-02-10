//допоміжну функцію-обгортку для всих запитів (використання try-catch)

export const ctrlWrapper = (controller) => {
  return async (req, res, next) => {
    try {
      await controller(req, res, next);
    } catch (err) {
      next(err); //передасть управління до middleware із server.js яка оголошує 4 параметри: err, req, res та next.
    }
  };
};
