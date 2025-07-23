import { Contact } from '../db/models/Contact.js';

export const getAllContacts = async ({
  page,
  perPage,
  sortBy,
  sortOrder,
  filter,
  userId,
}) => {
  const skip = (page - 1) * perPage;
  const baseFilter = { userId };

  if (filter.isFavourite) {
    baseFilter.isFavourite = filter.isFavourite;
  }
  if (filter.contactType) {
    baseFilter.contactType = filter.contactType;
  }

  const data = await Contact.find(baseFilter)
    .sort({ [sortBy]: sortOrder })
    .skip(skip)
    .limit(perPage);

  const totalItems = await Contact.countDocuments(baseFilter);

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

export const getContactById = async (contactId, userId) => {
  return await Contact.findOne({ _id: contactId, userId });
};

export const createContact = async (data) => {
  return await Contact.create(data);
};

export const updateContact = async (contactId, data, userId) => {
  return await Contact.findOneAndUpdate({ _id: contactId, userId }, data, {
    new: true,
    runValidators: true,
  });
};

export const deleteContact = async (contactId, userId) => {
  return await Contact.findOneAndDelete({ _id: contactId, userId });
};
