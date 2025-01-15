const router = require("express").Router();

const userRouter = require("./users");

router.use("/users", userRouter);

const clothingItemRouter = require("./clothingItems");

router.use("/items", clothingItemRouter);

module.exports = router;
