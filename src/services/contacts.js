import { Contact } from '../db/models/Contact.js';

export const getAllContacts = async ({ page, perPage }) => {
  const skip = (page - 1) * perPage;

  const data = await Contact.find().skip(skip).limit(perPage);
  const totalItems = await Contact.countDocuments();
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
  });
};

export const deleteContact = async (contactId) => {
  return await Contact.findByIdAndDelete(contactId);
};
