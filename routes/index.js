const router = require("express").Router();
const {
  errorHandling,
} = require("../utils/errors");
const userRouter = require("./users");
const clothingItemRouter = require("./clothingItems");

router.use("/users", userRouter);
router.use("/items", clothingItemRouter);

router.use((err, req, res, next) => {
  errorHandling(res, err, "Clothing Item", next);
});

module.exports = router;
