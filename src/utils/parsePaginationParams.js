export const parsePaginationParams = (query) => {
  const page = parseInt(query.page) || 1;
  const perPage = parseInt(query.perPage) || 10;
  return { page, perPage };
};
