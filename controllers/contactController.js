const contacts = require("../models/contacts");

const getAllContacts = async (req, res) => {
    const allContacts = await contacts.listContacts();
    res.status(200).json({ data: allContacts });
};

const getOneContactById = async (req, res, next) => {
    const { contactId } = req.params;
    const contact = await contacts.getContactById(contactId);
    if (!contact) {
        return next();
    };
    res.status(200).json({ data: contact });
};

const addNewContact = async (req, res) => {
    const newContact = await contacts.addContact(req.body);
    res.status(201).json({ data: newContact });
};

const deleteContactById = async (req, res, next) => {
    const { contactId } = req.params;
    const contactToDelete = await contacts.removeContactById(contactId);
    if (contactToDelete === null) {
        return next();
    };
    res.status(200).json({ message: "Contact deleted" });
};

const updateSomeContact = async (req, res, next) => {
    const { contactId } = req.params;
    const { body } = req;
    const contactToUpdate = await contacts.updateContact(contactId, body);
    if (contactToUpdate === null) {
        return next();
    };
    res.status(200).json({ data: contactToUpdate });
};

module.exports = {
    getAllContacts,
    getOneContactById,
    addNewContact,
    deleteContactById,
    updateSomeContact,
};
