const ClothingItem = require("../models/clothingItem");
const { findUser } = require("./users");
const {
  BAD_REQUEST_ERROR_STATUS_CODE,
  INTERNAL_SERVER_ERROR_STATUS_CODE,
  RESOURCE_NOT_FOUND_ERROR_STATUS_CODE,
  RESOURCE_CREATED_STATUS_CODE,
  OK_STATUS_CODE,
  RESOURCE_NOT_FOUND_MESSAGE,
} = require("../utils/errors");
const mongoose = require("mongoose");
// GET /items

const getItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => {
      return res.status(OK_STATUS_CODE).send({ data: items });
    })
    .catch((err) => {
      console.log(err);
      return res
        .status(INTERNAL_SERVER_ERROR_STATUS_CODE)
        .send({ message: err.message });
    });
};

// POST /items

const createItem = async (req, res) => {
  const { name, weather, imageUrl, owner, likes, createdAt } = req.body;
  const userExists = await findUser(owner);
  console.log(userExists);
  if (userExists) {
    ClothingItem.create({ name, weather, imageUrl, owner, likes, createdAt })
      .then((clothingItem) => {
        return res
          .status(RESOURCE_CREATED_STATUS_CODE)
          .send({ data: clothingItem });
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
  } else {
    return res
      .status(RESOURCE_NOT_FOUND_ERROR_STATUS_CODE)
      .send({ message: RESOURCE_NOT_FOUND_MESSAGE });
  }
};

// DELETE /items/:itemId

const deleteItem = (req, res) => {
  const { itemId } = req.params;

  ClothingItem.findByIdAndRemove(itemId)
    .orFail()
    .then((clothingItem) => {
      return res.status(OK_STATUS_CODE).send({ data: clothingItem });
    })
    .catch((err) => {
      console.log(err);
      if (err.name === "DocumentNotFoundError") {
        // Send a 404 Not Found response
        return res
          .status(RESOURCE_NOT_FOUND_ERROR_STATUS_CODE)
          .send({ message: RESOURCE_NOT_FOUND_MESSAGE });
      }
      if (err.name == "CastError")
        return res
          .status(BAD_REQUEST_ERROR_STATUS_CODE)
          .send({ message: "Item Id is not in a valid format" });
      return res
        .status(INTERNAL_SERVER_ERROR_STATUS_CODE)
        .send({ message: err.message });
    });
};

const likeItem = (req, res) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } }, // add _id to the array if it's not there yet
    { new: true }
  )
    .then((clothingItem) => {
      console.log("LIKED");
      return res.status(OK_STATUS_CODE).send({ data: clothingItem });
    })
    .catch((err) => {
      console.log(err);
      return res
        .status(INTERNAL_SERVER_ERROR_STATUS_CODE)
        .send({ message: err.message });
    });
};

const dislikeItem = (req, res) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } }, // remove _id from the array
    { new: true }
  )
    .then((clothingItem) => {
      return res.status(OK_STATUS_CODE).send({ data: clothingItem });
    })
    .catch((err) => {
      console.log(err);
      return res
        .status(INTERNAL_SERVER_ERROR_STATUS_CODE)
        .send({ message: err.message });
    });
};

module.exports = { getItems, createItem, deleteItem, likeItem, dislikeItem };
