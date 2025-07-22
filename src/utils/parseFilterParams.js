export const parseFilterParams = (query) => {
  const filter = {};

  if (query.isFavourite) {
    filter.isFavourite = query.isFavourite === 'true';
  }

  if (query.type) {
    filter.contactType = query.type;
  }

  return filter;
};
