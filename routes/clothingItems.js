const router = require("express").Router();
const auth = require("../middlewares/auth");
const {validate} = require('../middlewares/validation');


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
router.post("/", validate, createItem);
router.delete("/:itemId", validate, deleteItem);

//  likes
router.put("/:itemId/likes", validate, likeItem);
router.delete("/:itemId/likes", validate, dislikeItem);

module.exports = router;
