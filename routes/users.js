const router = require("express").Router();
const auth = require("../middlewares/auth");
const { getCurrentUser, updateProfile } = require("../controllers/users");
const {validate} = require('../middlewares/validation');

router.use(auth);
router.get("/me", getCurrentUser);
router.patch("/me", validate, updateProfile);

module.exports = router;
