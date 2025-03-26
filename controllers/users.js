const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const JWT_SECRET = require("../utils/config");
const ConflictError = require('../errors/conflict-error');

const User = require("../models/user");
const {
  RESOURCE_CREATED_STATUS_CODE,
  OK_STATUS_CODE,
  RESOURCE_NOT_FOUND_ERROR_STATUS_CODE,
  errorHandling,
} = require("../utils/errors");

//  POST /users

const createUser = (req, res, next) => {
  const { name, avatar, email, password } = req.body;
  User.findOne({ email }).then((user) => {
    if (user) {
      return next(new ConflictError("Email already exists."))
    }
    bcrypt
      .hash(password, 10)
      .then((hash) => {
        User.create({ name, avatar, email, password: hash })
          .then((createdUser) => {
            const userpayload = createdUser.toObject();
            delete userpayload.password;
            res
              .status(RESOURCE_CREATED_STATUS_CODE)
              .send({ data: userpayload });
          })
          .catch((err) => {
            errorHandling(res, err, "User Id", next);
          });
      })
      .catch((err) => {
        next(err);
      });
      return res;
  });
};

const findUser = async (userId) => {
  try {
    await User.findById(userId).orFail();
    return true;
  } catch (err) {
    return false;
  }
};

//  GET /users/:userId

const getCurrentUser = (req, res, next) => {
  const userId = req.user._id;

  User.findById(userId)
    .orFail()
    .then((user) => {
      res.status(OK_STATUS_CODE).send({ data: user });
    })
    .catch((err) => {
      errorHandling(res, err, "User Id", next);
    });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      console.log(user._id);
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.send({ token, name: user.name, avatar: user.avatar, _id: user._id, email:user.email });
    })
    .catch((err) => {
      errorHandling(res, err, "", next);
    });
};

const updateProfile = (req, res, next) => {
  const userId = req.user._id;
  const { name, avatar } = req.body;
  console.log(`Updating profile: ${name} ${avatar}` );

  User.findOneAndUpdate(
    { _id: userId },
    { name, avatar },
    { new: true, runValidators: true, context: "query" }
  )
    .then((user) => {
      if (!user) {
        res
          .status(RESOURCE_NOT_FOUND_ERROR_STATUS_CODE)
          .send({ message: "User not found" });
      }
      res.send(user);
    })
    .catch((err) => {
      errorHandling(res, err, "User Id", next);
    });
};

module.exports = {
  createUser,
  getCurrentUser,
  findUser,
  login,
  updateProfile,
};
