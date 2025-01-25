const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const JWT_SECRET = require("../utils/config");

const User = require("../models/user");
const {
  RESOURCE_CREATED_STATUS_CODE,
  OK_STATUS_CODE,
  BAD_REQUEST_ERROR_STATUS_CODE,
  CONFLICT_ERROR_STATUS_CODE,
  RESOURCE_NOT_FOUND_ERROR_STATUS_CODE,
  MONGODB_DUPLICATE_ERROR_STATUS_CODE,
  errorHandling,
} = require("../utils/errors");

// GET /users

const getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      res.status(OK_STATUS_CODE).send({ data: users });
    })
    .catch((err) => {
      errorHandling(res, err, "User Id");
    });
};

//  POST /users

const createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;
  User.findOne({ email }).then((user) => {
    if (user) {
      res
        .status(CONFLICT_ERROR_STATUS_CODE)
        .send({ message: "Email already exists." });
      return;
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
            if (err.code === MONGODB_DUPLICATE_ERROR_STATUS_CODE)
              res
                .status(CONFLICT_ERROR_STATUS_CODE)
                .send({ message: "The email exists already." });
            else
              res
                .status(BAD_REQUEST_ERROR_STATUS_CODE)
                .send({ message: err.message });
          });
      })
      .catch((err) => {
        res.status(RESOURCE_CREATED_STATUS_CODE).send({ message: err.message });
      });
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

const getCurrentUser = (req, res) => {
  const userId = req.user._id;

  User.findById(userId)
    .orFail()
    .then((user) => {
      res.status(OK_STATUS_CODE).send({ data: user });
    })
    .catch((err) => {
      errorHandling(res, err, "User Id");
    });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.send({ token });
    })
    .catch((err) => {
      errorHandling(res, err, "");
    });
};

const updateProfile = (req, res) => {
  const userId = req.user._id;
  const { name, avatar } = req.body;

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
      errorHandling(res, err, "User Id");
    });
};

module.exports = {
  getUsers,
  createUser,
  getCurrentUser,
  findUser,
  login,
  updateProfile,
};
