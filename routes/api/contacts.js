const express = require("express");
const router = express.Router();

const contacts = require("../../models/contacts");
const { addContactSchema, changeContactSchema } = require("../../validation/validationSchemas");
const { validationBody } = require("../../validation/validationBody");

router.get('/', async (req, res, next) => {
  const allContacts = await contacts.listContacts();
  res.status(200).json({ data: allContacts });
});

router.get('/:contactId', async (req, res, next) => {
  const { contactId } = req.params;
  const contact = await contacts.getContactById(contactId);
  if (!contact) {
    return next();
  };
  res.status(200).json({ data: contact });
});

router.post('/', validationBody(addContactSchema), async (req, res, next) => {
  const { name, email, phone } = req.body;
  const newContact = await contacts.addContact({ name, email, phone });
  res.status(201).json({ data: newContact });
});

router.delete('/:contactId', async (req, res, next) => {
  const { contactId } = req.params;
  const contactToDelete = await contacts.removeContact(contactId);
  if (contactToDelete === null) {
    return next();
  };
  console.log(contactToDelete);
  res.status(200).json({ message: "Contact deleted" });
});

router.put('/:contactId', validationBody(changeContactSchema), async (req, res, next) => {
  const { contactId } = req.params;
  const { body } = req;
  const emptyReqBody = Object.keys(body).length === 0;
  if (emptyReqBody) {
    return res.status(400).json({ message: "Missing fields" })
  };
  const contactToUpdate = await contacts.updateContact(contactId, body);
  if (contactToUpdate === null) {
    return next();
  };
  res.status(200).json({ data: contactToUpdate });
});

module.exports = router;
