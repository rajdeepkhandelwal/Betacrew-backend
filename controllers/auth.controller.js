const User = require("../models/user.model");
const { check, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const expressJwt = require("express-jwt");

exports.signup = (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({
      error: errors.array()[0].msg,
    });
  }
  const user = new User(req.body);
  user.save((err, user) => {
    if (err) {
      return res.status(400).json({
        message: "Not able to save user in DB",
      });
    }
    res.json({
      name: user.name,
      id: user._id,
    });
  });
};

exports.signin = (req, res) => {
  const { email, password } = req.body;
  // check validation error
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      error: "Invalid Username & Password",
    });
  }
  User.findOne({ email }, (err, user) => {
    // check is user exist
    if (err || !user) {
      return res.status(400).json({
        error: "User email does not exist",
      });
    }
    // authenticate user
    if (!user.authenticate(password)) {
      return res.status(401).json({
        error: "Username and Password Incorrect",
      });
    }
    // create token
    const token = jwt.sign(
      { _id: user._id },
      process.env.SECRET || "defaultsecret"
    );
    // put token in cookie
    res.cookie("token", token, { expire: new Date() + 9999 });

    // send response to frontend
    const { _id, name, email } = user;
    return res.json({ token, user: { _id, name, email } });
  });
};

exports.signout = (req, res) => {
  res.clearCookie("token");
  res.json({
    message: "user Logout Successfully",
  });
};

//protected route
exports.isSignedIn = expressJwt({
  secret: process.env.SECRET || "defaultsecret",
  userProperty: "auth",
  algorithms: ["HS256"],
});

// custum middleware
exports.isAuthenticated = (req, res, next) => {
  let checker = req.profile && req.auth && req.profile._id == req.auth._id;
  if (!checker) {
    return res.status(403).json({
      error: "Access Denied",
    });
  }
  next();
};
