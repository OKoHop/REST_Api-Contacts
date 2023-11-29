const express = require("express");

const router = express.Router();
const {
  register,
  login,
  getUser,
  deleteToken,
  uploadAvatar,
} = require("../controller/auth");

const { validateBody, validateToken, upload } = require("../middleware");
const { shemas } = require("../models/users");

router.post("/register", validateBody(shemas.registerUser), register);

router.post("/login", validateBody(shemas.loginUser), login);

router.post("/logout", validateToken, deleteToken);

router.post("/current", validateToken, getUser);

router.patch("/avatars", validateToken, upload.single("avatar"), uploadAvatar);

module.exports = router;
