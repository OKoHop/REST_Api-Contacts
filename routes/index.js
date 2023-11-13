const express = require("express");

const router = express.Router();

const contactRotes = require("./contactsRouter");

router.use("/contacts", contactRotes);

module.exports = router;
