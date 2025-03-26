const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const JWT_SECRET = require("../utils/config");

const User = require("../models/user");
const {
  RESOURCE_CREATED_STATUS_CODE,
  OK_STATUS_CODE,
  BAD_REQUEST_ERROR_STATUS_CODE,
  INTERNAL_SERVER_ERROR_STATUS_CODE,
  CONFLICT_ERROR_STATUS_CODE,
  RESOURCE_NOT_FOUND_ERROR_STATUS_CODE,
  MONGODB_DUPLICATE_ERROR_STATUS_CODE,
  errorHandling,
} = require("../utils/errors");

//  POST /users

const createUser = (req, res, next) => {
  const { name, avatar, email, password } = req.body;
  console.log(avatar)
  User.findOne({ email }).then((user) => {
    if (user) {
      return res
        .status(CONFLICT_ERROR_STATUS_CODE)
        .json({ message: "Email already exists." });

    }
    console.log("Not found.")
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
        next(err);
        /*res
          .status(INTERNAL_SERVER_ERROR_STATUS_CODE)
          .send({ message: err.message });*/
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
      next(err);
      //errorHandling(res, err, "User Id");
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
      next(err);
      //console.log(err)
      //errorHandling(res, err, "");
    });
};

const updateProfile = (req, res, next) => {
  const userId = req.user._id;
  const { name, avatar } = req.body;
  console.log(name );
  console.log(avatar);
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
      next(err);
      //errorHandling(res, err, "User Id");
    });
};

module.exports = {
  createUser,
  getCurrentUser,
  findUser,
  login,
  updateProfile,
};
