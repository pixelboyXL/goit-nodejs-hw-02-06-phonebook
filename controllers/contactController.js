const { Contact } = require("../models/contacts.model");

const getAllContacts = async (req, res) => {
    const allContacts = await Contact.find();
    res.status(200).json({ data: allContacts });
};

const getOneContactById = async (req, res, next) => {
    const { contactId } = req.params;
    const contact = await Contact.findById(contactId);
    if (!contact) {
        return next();
    };
    res.status(200).json({ data: contact });
};

const addNewContact = async (req, res) => {
    const newContact = await Contact.create(req.body);
    res.status(201).json({ data: newContact });
};

const deleteContactById = async (req, res, next) => {
    const { contactId } = req.params;
    const contactToDelete = await Contact.findById(contactId);
    if (contactToDelete === null) {
        return next();
    };
    await Contact.findByIdAndDelete(contactToDelete);
    res.status(200).json({ message: "Contact deleted" });
};

const updateSomeContact = async (req, res, next) => {
    const { contactId } = req.params;
    const { body } = req;
    const contactToUpdate = await Contact.findById(contactId);
    if (contactToUpdate === null) {
        return next();
    };
    await Contact.findByIdAndUpdate(contactToUpdate, body);
    res.status(200).json({ data: contactToUpdate });
};

const updateStatusContact = async (req, res, next) => {
    const { contactId } = req.params;
    const { favorite } = req.body;
    console.log(favorite);
    if (favorite === undefined) {
        throw new Error("Missing field favorite");
    }
    const contactToUpdate = await Contact.findById(contactId);
    if (contactToUpdate === null) {
        return next();
    };
    await Contact.findByIdAndUpdate(contactToUpdate, { favorite });
    res.status(200).json({ data: contactToUpdate.favorite });
};

module.exports = {
    getAllContacts,
    getOneContactById,
    addNewContact,
    deleteContactById,
    updateSomeContact,
    updateStatusContact,
};