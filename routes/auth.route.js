const router = require("express").Router();
const { check, validationResult } = require("express-validator");
const { signout, signup, signin } = require("../controllers/auth.controller");

router.post(
  "/signup",
  [
    check("name", "name should be atleast 3 char").isLength({ min: 3 }),
    check("email", "Enter Valid Email").isEmail(),
    check("password", "password should be atleast 3 char").isLength({ min: 3 }),
  ],
  signup
);

router.post(
  "/signin",
  [
    check("email", "Enter Valid Email").isEmail(),
    check("password", "password field is required").isLength({ min: 3 }),
  ],
  signin
);

router.get("/signout", signout);

module.exports = router;
