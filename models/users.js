const { Schema, model } = require("mongoose");
const Joi = require("joi");

const regexpEmail = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;

const userSchema = new Schema(
  {
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      match: regexpEmail,
    },
    subscription: {
      type: String,
      enum: ["starter", "pro", "business"],
      default: "starter",
    },
    token: {
      type: String,
      default: null,
    },
  },
  { versionKey: false, timestamps: true }
);

const registerUser = Joi.object({
  password: Joi.string().required(),
  email: Joi.string().pattern(regexpEmail).required(),
  subscription: Joi.string().default("starter"),
});

const loginUser = Joi.object({
  email: Joi.string().pattern(regexpEmail).required(),
  password: Joi.string().required(),
});

const shemas = { registerUser, loginUser };

const User = model("user", userSchema);

module.exports = { User, shemas };
