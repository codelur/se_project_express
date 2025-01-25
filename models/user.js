const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const {
  UNAUTHORIZED_ACCESS_ERROR_STATUS_CODE,
  BAD_REQUEST_ERROR_STATUS_CODE,
} = require("../utils/errors");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, minLength: 2, maxLength: 30 },
  avatar: {
    type: String,
    required: [true, "The avatar field is required."],
    validate: {
      validator(value) {
        return validator.isURL(value);
      },
      message: "You must enter a valid URL.",
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator(value) {
        return validator.isEmail(value);
      },
      message: "You must enter a valid email.",
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

userSchema.statics.findUserByCredentials = function findUserByCredentials(
  email,
  password
) {
  return this.findOne({ email })
    .select("+password")
    .then((user) => {
      if (!email || !password) {
        const error = new Error("The request is missing email or password");
        error.status = 400;
        return Promise.reject(error);
      }
      if (!user) {
        const error = new Error("Incorrect email or password");
        error.status = UNAUTHORIZED_ACCESS_ERROR_STATUS_CODE;
        return Promise.reject(error);
      }
      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          const error = new Error("Incorrect email or password");
          error.status = UNAUTHORIZED_ACCESS_ERROR_STATUS_CODE;
          return Promise.reject(error);
        }

        return user;
      });
    });
};

userSchema
  .path("avatar")
  .validate(
    (value) => validator.isURL(value),
    "You must enter a valid URL for avatar."
  );

module.exports = mongoose.model("user", userSchema);
