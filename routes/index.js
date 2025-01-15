const router = require("express").Router();
const {
  RESOURCE_NOT_FOUND_ERROR_STATUS_CODE,
  RESOURCE_NOT_FOUND_MESSAGE,
} = require("../utils/errors");
const userRouter = require("./users");

router.use("/users", userRouter);

const clothingItemRouter = require("./clothingItems");

router.use("/items", clothingItemRouter);

router.use((req, res) => {
  res.status(RESOURCE_NOT_FOUND_ERROR_STATUS_CODE).send({
    message: RESOURCE_NOT_FOUND_MESSAGE,
  });
});

module.exports = router;
