const User = require("../models/user.model");

exports.getUserById = (req, res, next, id) => {
  User.findById(id).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "User Not Found",
      });
    }
    req.profile = user;
    next();
  });
};

exports.getUser = (req, res) => {
  req.profile.salt = undefined;
  req.profile.enc_password = undefined;
  req.profile.createdAt = undefined;
  req.profile.updatedAt = undefined;
  return res.json(req.profile);
};
