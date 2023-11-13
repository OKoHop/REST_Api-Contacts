const express = require("express");
const {
  getAll,
  getById,
  addContact,
  updateContact,
  patchContact,
  deleteContact,
} = require("../controller/contacts");
const { isValidId } = require("../middleware");
const { schemas } = require("../models/contact");
const { validateBody } = require("../middleware");

const router = express.Router();

router.get("/", getAll);

router.get("/:contactId", isValidId, getById);

router.post("/", validateBody(schemas.validateSchema), addContact);

router.put("/:contactId", isValidId, updateContact);

router.patch(
  "/:contactId/favorite",
  isValidId,
  validateBody(schemas.validateFavorite),
  patchContact
);

router.delete("/:contactId", isValidId, deleteContact);

module.exports = router;
