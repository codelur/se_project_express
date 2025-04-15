const router = require("express").Router();
const {
  RESOURCE_NOT_FOUND_ERROR_STATUS_CODE,
  errorHandling,
} = require("../utils/errors");
const userRouter = require("./users");
const clothingItemRouter = require("./clothingItems");

router.use("/users", userRouter);
router.use("/items", clothingItemRouter);

router.use((req, res, next) => {
  const err = new Error("Resource not found");
  err.status = RESOURCE_NOT_FOUND_ERROR_STATUS_CODE;
  errorHandling(res, err, "Clothing Item", next);
});

module.exports = router;
