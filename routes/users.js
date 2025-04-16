const router = require("express").Router();
const auth = require("../middlewares/auth");
const { getCurrentUser, updateProfile } = require("../controllers/users");
const {validateProfileBody} = require('../middlewares/validation');

router.use(auth);
router.get("/me", getCurrentUser);
router.patch("/me", validateProfileBody, updateProfile);

module.exports = router;
