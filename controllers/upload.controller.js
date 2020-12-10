const Upload = require("../models/upload.model");
const formidable = require("formidable");
const _ = require("lodash");
const fs = require("fs");

exports.getFileById = (req, res, next, id) => {
  Upload.findById(id).exec((err, file) => {
    if (err) {
      return res.status(400).json({
        error: "File Not Found in DB",
      });
    }
    req.file = file;

    next();
  });
};

exports.uploadFile = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;

  form.parse(req, (err, field, file) => {
    if (err) {
      return res.status(400).json({
        error: "Problem with Form Input",
      });
    }
    //model
    let upload = new Upload(field);
    // handle file here
    if (file.userfile) {
      if (file.userfile.size > 2 * 1024 * 1024) {
        return res.status(400).json({
          error: "File Size too Big",
        });
      }
      upload.userFile.data = fs.readFileSync(file.userfile.path);
      upload.userFile.contentType = file.userfile.type;
      upload.owner.id = req.params.userId;
      upload.name = file.userfile.name;
    } else {
      return res.status(400).json({
        error: "Select The file",
      });
    }
    // save to db
    upload.save((err, upload) => {
      if (err) {
        return res.status(400).json({
          error: "Failed to save file in DB",
        });
      }
      res.json(upload);
    });
  });
};

exports.getFileByUserId = (req, res) => {
  const ownerId = req.params.userId;
  Upload.find({ "owner.id": ownerId })
    .sort({ createdAt: -1 })
    .exec((err, uploads) => {
      if (err) {
        return res.status(400).json({
          error: "Product Not Found in DB",
        });
      }
      return res.json(uploads);
    });
};

exports.getFile = (req, res, next) => {
  if (req.file.userFile.data) {
    res.set("Content-Type", req.file.userFile.contentType);
    return res.send(req.file.userFile.data);
  }
  next();
};
