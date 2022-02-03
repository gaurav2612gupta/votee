const express = require("express");
const router = express.Router();
const passport = require("passport");

const {
  adminLogin,

  addVoter,
  //   getAllStudents,
  addAdmin,
  //   getAllStudent,
} = require("../controller/adminController");

router.post("/login", adminLogin);
router.post("/addAdmin", addAdmin);

// router.post(
//   "/getAllVoters",
//   passport.authenticate("jwt", { session: false }),
//   getAllStudent
// );

router.post(
  "/addVoter",
  passport.authenticate("jwt", { session: false }),
  addVoter
);

module.exports = router;
