const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const uploadSchema = new mongoose.Schema(
  {
    name: String,
    userFile: {
      data: Buffer,
      contentType: String,
    },
    owner: {
      id: {
        type: ObjectId,
        ref: "User",
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Upload", uploadSchema);
