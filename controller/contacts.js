const { Contact } = require("../models/contact");
const { ctrlWrap } = require("../helpers");

const getAll = async (req, res, _) => {
  const data = await Contact.find();
  res.status(200).send(data);
};

const getById = async (req, res, _) => {
  const { contactId } = req.params;
  const data = await Contact.findById(contactId);
  res.status(200).send(data);
};

const addContact = async (req, res, _) => {
  const data = await Contact.create(req.body);
  res.status(201).send(data);
};

const updateContact = async (req, res, _) => {
  const updateContact = req.body;
  const { contactId } = req.params;
  const data = await Contact.findByIdAndUpdate(contactId, updateContact, {
    new: true,
  });
  if (!data) {
    res.status(404).send({ message: "Not found" });
  }
  res.status(200).send(data);
};

const patchContact = async (req, res, _) => {
  const { contactId } = req.params;
  const updateFavorite = req.body;
  const data = await Contact.findByIdAndUpdate(contactId, updateFavorite, {
    new: true,
  });
  if (!data) {
    res.status(404).send({ message: "Not found" });
  }
  res.status(200).send(data);
};

const deleteContact = async (req, res, _) => {
  const { contactId } = req.params;
  const data = await Contact.findByIdAndDelete(contactId);
  if (!data) {
    res.status(404).send({ message: "Not found" });
  }
  res.status(200).send(data);
};

module.exports = {
  getAll: ctrlWrap(getAll),
  getById: ctrlWrap(getById),
  addContact: ctrlWrap(addContact),
  updateContact: ctrlWrap(updateContact),
  patchContact: ctrlWrap(patchContact),
  deleteContact: ctrlWrap(deleteContact),
};
