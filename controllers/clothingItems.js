const ClothingItem = require("../models/clothingItem");
//  const { findUser } = require("./users");
const {
  FORBIDDEN_ACCESS_ERROR_STATUS_CODE,
  RESOURCE_CREATED_STATUS_CODE,
  RESOURCE_NOT_FOUND_ERROR_STATUS_CODE,
  OK_STATUS_CODE,
  errorHandling,
} = require("../utils/errors");

// GET /items

const getItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => {
      res.status(OK_STATUS_CODE).send({ data: items });
    })
    .catch((err) => {
      errorHandling(res, err, "Item Id");
    });
};

// POST /items

const createItem = async (req, res) => {
  const { name, weather, imageUrl } = req.body;
  ClothingItem.create({
    name,
    weather,
    imageUrl,
    owner: req.user._id,
  })
    .then((clothingItem) => {
      res.status(RESOURCE_CREATED_STATUS_CODE).send({ data: clothingItem });
    })
    .catch((err) => {
      errorHandling(res, err, "Item Id");
    });
};

// DELETE /items/:itemId

const deleteItem = (req, res) => {
  const { itemId } = req.params;
  const userId = req.user._id;
  ClothingItem.findById(itemId)
    .then((item) => {
      if (!item) {
        res
          .status(RESOURCE_NOT_FOUND_ERROR_STATUS_CODE)
          .send({ message: "The item doesnt exist." });
        return;
      }
      if (item.owner.toString() !== userId) {
        console.log(item.owner);
        console.log(userId);
        res
          .status(FORBIDDEN_ACCESS_ERROR_STATUS_CODE)
          .send({ message: "You cannot delete this item" });
        return;
      }

      ClothingItem.findByIdAndRemove(itemId)
        .orFail()
        .then((clothingItem) => {
          res.status(OK_STATUS_CODE).send({ data: clothingItem });
        })
        .catch((err) => {
          errorHandling(res, err, "Item Id");
        });
    })
    .catch((err) => {
      errorHandling(res, err, "");
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
      res.status(OK_STATUS_CODE).send({ data: clothingItem });
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
      res.status(OK_STATUS_CODE).send({ data: clothingItem });
    })
    .catch((err) => {
      errorHandling(res, err, "Item Id");
    });
};

module.exports = { getItems, createItem, deleteItem, likeItem, dislikeItem };
