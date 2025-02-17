//sort

export const parseSortParams = (query) => {
  const sortOrder = ['asc', 'desc'].includes(query.sortOrder)
    ? query.sortOrder
    : 'asc';

  const sortBy = ['name', 'age', 'gender', 'onDuty'].includes(query.sortBy)
    ? query.sortBy
    : '_id';
  return { sortOrder, sortBy };
};
