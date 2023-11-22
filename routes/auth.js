const express = require("express");

const router = express.Router();
const { register, login, getUser, deleteToken } = require("../controller/auth");

const { validateBody, validateToken } = require("../middleware");
const { shemas } = require("../models/users");

router.post("/register", validateBody(shemas.registerUser), register);

router.post("/login", validateBody(shemas.loginUser), login);

router.post("/logout", validateToken, deleteToken);

router.post("/current", validateToken, getUser);

module.exports = router;
