const router = require("express").Router();

const {
  uploadFile,
  getFileByUserId,
  getFileById,
  getFile,
} = require("../controllers/upload.controller");
const { getUserById } = require("../controllers/user.controller");
const {
  isSignedIn,
  isAuthenticated,
} = require("../controllers/auth.controller");
//all params
router.param("userId", getUserById);
router.param("fileId", getFileById);

router.get("/getfile/:userId", isSignedIn, isAuthenticated, getFileByUserId);
router.get("/file/:userId/:fileId", getFile);
// create
router.post("/upload/:userId", isSignedIn, isAuthenticated, uploadFile);

module.exports = router;
