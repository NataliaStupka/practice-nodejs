//Filter

import { GENDERS } from '../constants/gender.js';

const parseNumber = (string, defaultValue) => {
  const number = Number(string);
  if (Number.isNaN(number)) {
    return defaultValue;
  }
  return number;
};

const parseGender = (string) => {
  if (Object.values(GENDERS).includes(string)) return string;
};
const parseBoolean = (string) => {
  if (['true', 'false'].includes(string)) return JSON.parse(string);
};

export const parseFilters = (filter) => {
  console.log('ZARAZA:', filter);
  //filter - gender, maxAge, minAge, maxAvgMark, minAvgMark
  return {
    gender: parseGender(filter.gender),
    minAge: parseNumber(filter.minAge),
    maxAge: parseNumber(filter.maxAge),
    minAvgMark: parseNumber(filter.minAvgMark),
    maxAvgMark: parseNumber(filter.maxAvgMark),
    onDuty: parseBoolean(filter.onDuty),
  };
};

// export const GENDERS = {
//   MALE: 'male',
//   FEMALE: 'female',
// };
