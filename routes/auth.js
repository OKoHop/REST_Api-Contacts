const express = require("express");

const router = express.Router();
const { register, login } = require("../controller/auth");

const { validateBody } = require("../middleware");
const { shemas } = require("../models/users");

router.post("/register", validateBody(shemas.registerUser), register);

router.post("/login", validateBody(shemas.loginUser), login);

module.exports = router;
