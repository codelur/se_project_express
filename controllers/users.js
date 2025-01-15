const User = require("../models/user");
const {
  RESOURCE_CREATED_STATUS_CODE,
  OK_STATUS_CODE,
  errorHandling,
} = require("../utils/errors");

// GET /users

const getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      return res.status(OK_STATUS_CODE).send({ data: users });
    })
    .catch((err) => {
      errorHandling(res, err, "User Id");
    });
};

//POST /users

const createUser = (req, res) => {
  const { name, avatar } = req.body;
  User.create({ name, avatar })
    .then((user) => {
      return res.status(RESOURCE_CREATED_STATUS_CODE).send({ data: user });
    })
    .catch((err) => {
      errorHandling(res, err, "User Id");
    });
};

const findUser = async (userId) => {
  try {
    await User.findById(userId).orFail();
    console.log("User found: " + userId);
    return true;
  } catch (err) {
    console.log(err);
    console.log("User not found: " + userId);
    return false;
  }
};

//GET /users/:userId

const getUser = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .orFail()
    .then((user) => {
      return res.status(OK_STATUS_CODE).send({ data: user });
    })
    .catch((err) => {
      errorHandling(res, err, "User Id");
    });
};

module.exports = { getUsers, createUser, getUser, findUser };
