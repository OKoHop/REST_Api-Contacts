const express = require("express");
const {
  getAll,
  getById,
  addContact,
  updateContact,
  patchContact,
  deleteContact,
} = require("../controller/contacts");
const { isValidId, validateBody, validateToken } = require("../middleware");
const { schemas } = require("../models/contact");

const router = express.Router();

router.get("/", validateToken, getAll);

router.get("/:contactId", validateToken, isValidId, getById);

router.post(
  "/",
  validateToken,
  validateBody(schemas.validateSchema),
  addContact
);

router.put(
  "/:contactId",
  validateToken,
  isValidId,
  validateBody(schemas.validateSchema),
  updateContact
);

router.patch(
  "/:contactId/favorite",
  validateToken,
  isValidId,
  validateBody(schemas.validateFavorite),
  patchContact
);

router.delete("/:contactId", validateToken, isValidId, deleteContact);

module.exports = router;
