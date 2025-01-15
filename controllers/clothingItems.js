const ClothingItem = require("../models/clothingItem");
const { findUser } = require("./users");
const {
  RESOURCE_CREATED_STATUS_CODE,
  OK_STATUS_CODE,
  errorHandling,
} = require("../utils/errors");
const mongoose = require("mongoose");
// GET /items

const getItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => {
      return res.status(OK_STATUS_CODE).send({ data: items });
    })
    .catch((err) => {
      errorHandling(res, err, "Item Id");
    });
};

// POST /items

const createItem = async (req, res) => {
  const { name, weather, imageUrl, owner, likes, createdAt } = req.body;
  /*const userExists = await findUser(owner);
  if (userExists) {*/
  ClothingItem.create({
    name,
    weather,
    imageUrl,
    owner: req.user._id,
    likes,
    createdAt,
  })
    .then((clothingItem) => {
      return res
        .status(RESOURCE_CREATED_STATUS_CODE)
        .send({ data: clothingItem });
    })
    .catch((err) => {
      errorHandling(res, err, "Item Id");
    });
  /*} else {
    return res
      .status(RESOURCE_NOT_FOUND_ERROR_STATUS_CODE)
      .send({ message: RESOURCE_NOT_FOUND_MESSAGE });
  }*/
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
      errorHandling(res, err, "Item Id");
    });
};

const likeItem = (req, res) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } }, // add _id to the array if it's not there yet
    { new: true }
  )
    .orFail()
    .then((clothingItem) => {
      console.log("LIKED");
      return res.status(OK_STATUS_CODE).send({ data: clothingItem });
    })
    .catch((err) => {
      errorHandling(res, err, "Item Id");
    });
};

const dislikeItem = (req, res) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } }, // remove _id from the array
    { new: true }
  )
    .orFail()
    .then((clothingItem) => {
      return res.status(OK_STATUS_CODE).send({ data: clothingItem });
    })
    .catch((err) => {
      errorHandling(res, err, "Item Id");
    });
};

module.exports = { getItems, createItem, deleteItem, likeItem, dislikeItem };
