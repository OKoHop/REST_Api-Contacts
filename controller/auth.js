const { User } = require("../models/users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const { SECRET_KEY } = process.env;

const ctrlWrapper = require("../helpers/ctrlWrapper");

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
  });
  res.status(201).send({
    user: {
      email: data.email,
      subscription: data.subscription,
    },
  });
};

const loginUser = async (req, res, _) => {
  const { email, password } = req.body;
  const data = await User.findOne({ email });

  if (!data) {
    res.status(401).send({
      message: "Email or password is wrong",
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

  res.status(200).send({
    token,
    user: {
      email: data.email,
      subscription: data.subscription,
    },
  });
};

module.exports = {
  register: ctrlWrapper(createUser),
  login: ctrlWrapper(loginUser),
};
