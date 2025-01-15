const User = require("../models/user");
const {
  BAD_REQUEST_ERROR_STATUS_CODE,
  INTERNAL_SERVER_ERROR_STATUS_CODE,
  RESOURCE_NOT_FOUND_ERROR_STATUS_CODE,
  RESOURCE_CREATED_STATUS_CODE,
  OK_STATUS_CODE,
} = require("../utils/errors");

// GET /users

const getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      return res.status(OK_STATUS_CODE).send({ data: users });
    })
    .catch((err) => {
      console.log(err);
      return res
        .status(INTERNAL_SERVER_ERROR_STATUS_CODE)
        .send({ message: err.message });
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
      console.log(err);
      if (err.name == "ValidationError")
        return res
          .status(BAD_REQUEST_ERROR_STATUS_CODE)
          .send({ message: err.message });

      return res
        .status(INTERNAL_SERVER_ERROR_STATUS_CODE)
        .send({ message: err.message });
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
      console.log(err);
      if (err.name === "DocumentNotFoundError") {
        // Send a 404 Not Found response
        return res
          .status(RESOURCE_NOT_FOUND_ERROR_STATUS_CODE)
          .send({ message: "User not found" });
      }
      if (err.name == "CastError")
        return res
          .status(BAD_REQUEST_ERROR_STATUS_CODE)
          .send({ message: "User Id is not in a valid format" });
      return res
        .status(INTERNAL_SERVER_ERROR_STATUS_CODE)
        .send({ message: err.message });
    });
};

module.exports = { getUsers, createUser, getUser, findUser };
