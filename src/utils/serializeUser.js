// обгортка що віддаємо на фронтенд
// поля які повертаємо при response
//без паролю

export const serializeUser = (user) => ({
  name: user.name,
  email: user.email,
  avatarUrl: user.avatarUrl,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
  _id: user._id,
});
