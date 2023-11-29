const { Contact } = require("../models/contact");
const { ctrlWrap } = require("../helpers");

const getAll = async (req, res, _) => {
  const { favorite } = req.query;
  const { _id: owner } = req.user;
  const { page = 1, limit = 20 } = req.query;
  const skip = (page - 1) * limit;
  const data = await Contact.find({ owner }, "-createdAt -updatedAt", {
    skip,
    limit,
  });

  if (favorite !== undefined) {
    console.log(favorite);

    data.map((contact) => {
      return contact.favorite === favorite && console.log(contact);
    });
  }

  res.status(200).send(data);
};

const getById = async (req, res, next) => {
  const { contactId } = req.params;
  const userId = req.user._id;
  const data = await Contact.findById(contactId, "-createdAt -updatedAt");
  if (!data || JSON.stringify(data.owner) !== JSON.stringify(userId)) {
    return res.status(404).send({ message: "Not found" });
  }
  return res.status(200).send(data);
};

const addContact = async (req, res, _) => {
  const { _id: owner } = req.user;
  const data = await Contact.create(
    { ...req.body, owner },
    "-createdAt -updatedAt"
  );
  res.status(201).send(data);
};

const updateContact = async (req, res, _) => {
  const updateContact = req.body;
  const { contactId } = req.params;

  const userId = req.user._id;
  const contactOwner = await Contact.findById(contactId);
  if (
    !contactOwner ||
    JSON.stringify(contactOwner.owner) !== JSON.stringify(userId)
  ) {
    return res.status(404).send({ message: "Not found" });
  }

  const data = await Contact.findByIdAndUpdate(
    contactId,
    updateContact,
    {
      new: true,
    },
    "-createdAt -updatedAt"
  );

  return res.status(200).send(data);
};

const patchContact = async (req, res, _) => {
  const { contactId } = req.params;
  const updateFavorite = req.body;

  const userId = req.user._id;
  const contactOwner = await Contact.findById(contactId);
  if (
    !contactOwner ||
    JSON.stringify(contactOwner.owner) !== JSON.stringify(userId)
  ) {
    return res.status(404).send({ message: "Not found" });
  }

  const data = await Contact.findByIdAndUpdate(
    contactId,
    updateFavorite,
    {
      new: true,
    },
    "-createdAt -updatedAt"
  );
  return res.status(200).send(data);
};

const deleteContact = async (req, res, next) => {
  const { contactId } = req.params;
  const userId = req.user._id;
  const contactOwner = await Contact.findById(contactId);
  if (
    !contactOwner ||
    JSON.stringify(contactOwner.owner) !== JSON.stringify(userId)
  ) {
    return res.status(404).send({
      message: "Not found",
    });
  }
  const data = await Contact.findByIdAndDelete(
    contactId,
    "-createdAt -updatedAt"
  );
  return res.status(200).send(data);
};

module.exports = {
  getAll: ctrlWrap(getAll),
  getById: ctrlWrap(getById),
  addContact: ctrlWrap(addContact),
  updateContact: ctrlWrap(updateContact),
  patchContact: ctrlWrap(patchContact),
  deleteContact: ctrlWrap(deleteContact),
};
