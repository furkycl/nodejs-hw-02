export const parseFilterParams = (query) => {
  const filter = {};

  // isFavourite filtresi: "true" string'ini boolean'a çeviriyoruz.
  if (query.isFavourite) {
    filter.isFavourite = query.isFavourite === 'true';
  }

  // contactType filtresi (eğer modelde varsa)
  if (query.type) {
    filter.contactType = query.type;
  }

  return filter;
};
