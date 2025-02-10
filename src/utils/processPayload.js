//прийшло firstName, secondName, ...payload
// об'єднали firstName, secondName в name
//при createStudent

//якщо нічого не прийшло для firstName, secondName
const processName = (firstName, secondName) => {
  if (!firstName || !secondName) {
    return firstName + ' ' + secondName;
  }
};

export const processStudentPayload = ({
  firstName,
  secondName,
  ...payload
}) => ({
  ...payload,
  ...(processName(firstName, secondName) //чи прийшло?
    ? { name: processName(firstName, secondName) } //якщо так
    : {}), //нічого не додається
});

// замінюємо payload в services/students.js
