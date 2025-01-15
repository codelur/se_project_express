const router = require("express").Router();
const {
  getItems,
  createItem,
  deleteItem,
} = require("../controllers/clothingItems");

//items
router.get("/", getItems);
router.post("/", createItem);
router.delete("/:itemId", deleteItem);

//likes
router.put("/:itemId/likes", deleteItem);
router.delete("/:itemId/likes", deleteItem);

module.exports = router;
