const express = require("express");
const router = express.Router();
const passport = require("passport");
const upload = require("../utils/multer");
const {
  adminLogin,

  addVoter,

  addAdmin,
} = require("../controller/adminController");

router.post("/login", adminLogin);
router.post("/addAdmin", addAdmin);

router.post(
  "/addVoter",
  upload.single("excel"),

  passport.authenticate("jwt", { session: false }),
  addVoter
);

module.exports = router;
