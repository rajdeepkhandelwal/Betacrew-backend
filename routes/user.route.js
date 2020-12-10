const router = require("express").Router();

const { getUserById, getUser } = require("../controllers/user.controller");
const {
  isSignedIn,
  isAuthenticated,
} = require("../controllers/auth.controller");

router.param("userId", getUserById);

router.get("/user/:userId", isSignedIn, isAuthenticated, getUser);

module.exports = router;
