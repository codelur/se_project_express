const ClothingItem = require("../models/clothingItem");
//  const { findUser } = require("./users");
const {
  FORBIDDEN_ACCESS_ERROR_STATUS_CODE,
  RESOURCE_CREATED_STATUS_CODE,
  DOCUMENT_NOT_FOUND_ERROR,
  OK_STATUS_CODE,
  errorHandling,
} = require("../utils/errors");

// GET /items

const getItems = (req, res, next) => {
  ClothingItem.find({})
    .then((items) => {
      res.status(OK_STATUS_CODE).send({ data: items });
    })
    .catch((err) => {
      next(err);
      //errorHandling(res, err, "Item Id");
    });
};

// POST /items

const createItem = async (req, res, next) => {
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
      next(err);
      //errorHandling(res, err, "Item Id");
    });
};

// DELETE /items/:itemId

const deleteItem = (req, res, next) => {
  const { itemId } = req.params;
  const userId = req.user._id;
  ClothingItem.findById(itemId)
    .then((item) => {
      if (!item) {
        const err = new Error();
        err.name = DOCUMENT_NOT_FOUND_ERROR;
        errorHandling(res, err);
        return;
      }
      if (item.owner.toString() !== userId) {
        /*const err = new Error();
        err.status = FORBIDDEN_ACCESS_ERROR_STATUS_CODE;
        errorHandling(res, err);*/
        next(err);
        return;
      }

      ClothingItem.findByIdAndRemove(itemId)
        .orFail()
        .then((clothingItem) => {
          res.status(OK_STATUS_CODE).send({ data: clothingItem });
        })
        .catch((err) => {
          next(err);
        //errorHandling(res, err, "Item Id");
        });
    })
    .catch((err) => {
      next(err);
      //errorHandling(res, err, "");
    });
};

const likeItem = (req, res, next) => {

  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } }, // add _id to the array if it's not there yet
    { new: true }
  )
    .orFail()
    .then((clothingItem) => {
      console.log(clothingItem)
      res.status(OK_STATUS_CODE).send({ data: clothingItem });
    })
    .catch((err) => {
      next(err);
      //console.log(err)
      //errorHandling(res, err, "Item Id");
    });
};

const dislikeItem = (req, res, next) => {
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
      next(err);
      //errorHandling(res, err, "Item Id");
    });
};

module.exports = { getItems, createItem, deleteItem, likeItem, dislikeItem };
