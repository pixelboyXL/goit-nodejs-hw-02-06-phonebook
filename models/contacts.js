const fs = require("fs/promises");
const path = require("path");
const { nanoid } = require("nanoid");

const contactsPath = path.join(__dirname, "./contacts.json");

const listContacts = async () => {
  const contactsRaw = await fs.readFile(contactsPath, "utf8");
  const contacts = JSON.parse(contactsRaw);
  return contacts;
};

const getContactById = async (contactId) => {
  const contacts = await listContacts();
  const contactToFind = contacts.find(contact => contact.id === contactId);
  return contactToFind;
};

const removeContactById = async (contactId) => {
  const contacts = await listContacts();
  const contactToDelete = contacts.find(contact => contact.id === contactId);
  if (!contactToDelete) {
    return null;
  };
  const remainingСontacts = contacts.filter(contact => contact.id !== contactId);
  await fs.writeFile(contactsPath, JSON.stringify(remainingСontacts));
  return contactToDelete;
};

const addContact = async (body) => {
  const { name, email, phone } = body;
  const id = nanoid();
  const newContact = { id, name, email, phone };
  const contacts = await listContacts();
  contacts.push(newContact);
  await fs.writeFile(contactsPath, JSON.stringify(contacts));
  return newContact;
};

const updateContact = async (contactId, body) => {
  const { name, email, phone } = body;
  const contacts = await listContacts();
  const contactToUpdate = contacts.find(contact => contact.id === contactId);
  if (!contactToUpdate) {
    return null;
  };
  if (name !== undefined) {
    contactToUpdate.name = name;
  }
  if (email !== undefined) {
    contactToUpdate.email = email;
  }
  if (phone !== undefined) {
    contactToUpdate.phone = phone;
  }
  await fs.writeFile(contactsPath, JSON.stringify(contacts));
  return contactToUpdate;
};

module.exports = {
  listContacts,
  getContactById,
  removeContactById,
  addContact,
  updateContact,
};
