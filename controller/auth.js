const { User } = require("../models/users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");
const Jimp = require("jimp");
const { v4: uuidv4 } = require("uuid");
const { sendEmail } = require("../helpers");

require("dotenv").config();
const { SECRET_KEY, BASE_URL } = process.env;

const path = require("path");
const fs = require("fs/promises");

const ctrlWrapper = require("../helpers/ctrlWrapper");

const avatarStorage = path.join(__dirname, "../", "public", "avatars");

const createUser = async (req, res, _) => {
  const { email, password } = req.body;
  const userEmail = await User.findOne({ email });
  if (userEmail) {
    res.status(409).send({
      message: "Email in use",
    });
  }
  const data = await User.create({
    ...req.body,
    password: bcrypt.hashSync(password, 10),
    avatarURL: gravatar.url(email),
    verificationToken: uuidv4(),
  });

  const emailParams = {
    subject: "Verification email",
    to: `${email}`,
    from: `wovxeh@mailto.plus`,
    body: `<a target='blank' href='${BASE_URL}/users/verify/${data.verificationToken}'>Verify email</a>`,
  };

  await sendEmail(emailParams);

  res.status(201).send({
    user: {
      email: data.email,
      subscription: data.subscription,
      avatarURL: data.avatarURL,
      verificationToken: data.verificationToken,
    },
  });
};

const verifyUser = async (req, res) => {
  const { verificationToken } = req.params;
  const user = await User.findOne({ verificationToken });

  if (!user) {
    return res.status(404).send({
      message: "User not found",
    });
  }

  await User.findByIdAndUpdate(user._id, {
    verify: true,
    verificationToken: null,
  });
  return res.status(200).send({
    message: "Verification successful",
  });
};

const resendEmail = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).send({
      message: "missing required field email",
    });
  }

  const user = await User.findOne({ email });

  if (user.verify) {
    return res.status(400).send({
      message: "Verification has already been passed",
    });
  }

  const emailParams = {
    subject: "Verification email",
    to: `${email}`,
    from: `wovxeh@mailto.plus`,
    body: `<a target='blank' href='${BASE_URL}/users/verify/${user.verificationToken}'>Verify email</a>`,
  };

  await sendEmail(emailParams);

  res.status(200).send({ message: "Verification email sent" });
};

const loginUser = async (req, res, _) => {
  const { email, password } = req.body;
  const data = await User.findOne({ email });

  if (!data) {
    res.status(401).send({
      message: "Email or password is wrong",
    });
  }

  if (!data.verify) {
    return res.status(401).send({
      message: "Email nor verify",
    });
  }

  const validPassword = await bcrypt.compareSync(password, data.password);
  if (!validPassword) {
    res.status(401).send({
      message: "Email or password is wrong",
    });
  }

  const payload = {
    id: data._id,
  };

  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" });
  await User.findByIdAndUpdate(data._id, { token });
  res.status(200).send({
    token,
    user: {
      email: data.email,
      subscription: data.subscription,
    },
  });
};

const getUser = async (req, res) => {
  const { email, subscription } = req.user;
  res.status(200).send({
    email,
    subscription,
  });
};

const deleteToken = async (req, res) => {
  const { _id } = req.user;
  if (!_id) {
    res.status(401).send({
      message: "Not authorized",
    });
  }
  await User.findByIdAndUpdate(_id, { token: null });
  res.status(204).send({
    message: "Logout success",
  });
};

const uploadAvatar = async (req, res, next) => {
  const { _id } = req.user;
  if (!_id) {
    return res.status(401).send({
      message: "Not authorized",
    });
  }
  if (req.file === undefined) {
    res.status(404).send(
      `<img
          src="../public/avatars/img_not_found.jpg"
          alt="Img not found"
        ></img>`
    );
  }
  const { path: tempDir, originalname } = req.file;
  const fileName = `${_id}_${originalname}`;

  const avatarDir = path.join(avatarStorage, fileName);
  await fs.rename(tempDir, avatarDir);

  const avatarURL = path.join("avatar", fileName);

  const img = Jimp.read(avatarDir);
  (await img).resize(250, 250);
  (await img).write(avatarDir);

  await User.findByIdAndUpdate(_id, { avatarURL });

  res.status(200).send({
    avatarURL,
  });
};

module.exports = {
  register: ctrlWrapper(createUser),
  verifyUser: ctrlWrapper(verifyUser),
  login: ctrlWrapper(loginUser),
  getUser: ctrlWrapper(getUser),
  deleteToken: ctrlWrapper(deleteToken),
  uploadAvatar: ctrlWrapper(uploadAvatar),
  resendEmail: ctrlWrapper(resendEmail),
};
