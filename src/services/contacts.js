import { Contact } from '../db/models/Contact.js';
export const getAllContacts = async ({
  page,
  perPage,
  sortBy,
  sortOrder,
  filter,
}) => {
  const skip = (page - 1) * perPage;
  const filterQuery = {};
  if (filter.isFavourite) {
    filterQuery.isFavourite = filter.isFavourite;
  }
  const data = await Contact.find(filterQuery)
    .sort({ [sortBy]: sortOrder })
    .skip(skip)
    .limit(perPage);
  const totalItems = await Contact.countDocuments(filterQuery);
  const totalPages = Math.ceil(totalItems / perPage);
  return {
    data,
    page,
    perPage,
    totalItems,
    totalPages,
    hasPreviousPage: page > 1,
    hasNextPage: page < totalPages,
  };
};
export const getContactById = async (contactId) => {
  return await Contact.findById(contactId);
};

export const createContact = async (data) => {
  return await Contact.create(data);
};

export const updateContact = async (contactId, data) => {
  return await Contact.findByIdAndUpdate(contactId, data, {
    new: true,
    runValidators: true,
  });
};

export const deleteContact = async (contactId) => {
  return await Contact.findByIdAndDelete(contactId);
};
