const router = require("express").Router();
const auth = require("../middlewares/auth");
const {validateCardBody, validateId} = require('../middlewares/validation');


const {
  getItems,
  createItem,
  deleteItem,
  likeItem,
  dislikeItem,
} = require("../controllers/clothingItems");

//  items
router.get("/", getItems);
router.use(auth);
router.post("/", validateCardBody, createItem);
router.delete("/:itemId", validateId, deleteItem);

//  likes
router.put("/:itemId/likes", validateId, likeItem);
router.delete("/:itemId/likes", validateId, dislikeItem);

module.exports = router;
