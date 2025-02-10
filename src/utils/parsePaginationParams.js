//логіка парсингу параметрів пошуку

//перетворення рядкових значень в числа
const parseNumber = (number, defaultValue) => {
  const isString = typeof number === 'string';
  //??????
  if (!isString) return defaultValue;

  // parseInt - перетворення рядка в число
  // isNaN - не число
  const parsedNumber = parseInt(number);
  if (Number.isNaN(parsedNumber)) {
    return defaultValue;
  }

  return parsedNumber;
};

//У випадку успішного перетворення, функція повертає число parsedNumber.
export const parsePaginationParams = (query) => {
  const { page, perPage } = query;

  const parsedPage = parseNumber(page, 1);
  const parsedPerPage = parseNumber(perPage, 10);

  return {
    page: parsedPage,
    perPage: parsedPerPage,
  };
};
