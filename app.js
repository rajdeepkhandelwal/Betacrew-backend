require("dotenv").config();
const app = require("express")();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const userRoutes = require("./routes/user.route");
const authRoutes = require("./routes/auth.route");
const uploadRoutes = require("./routes/upload.route");

//Database Connection
mongoose
  .connect(process.env.DATABASE || "mongodb://localhost:27017/filedata", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => {
    console.log("DB CONNECTED");
  });
//Middlewares
app.use(bodyParser.json({ limit: "50mb" }));
app.use(cookieParser());
app.use(cors());

app.use("/api", userRoutes);
app.use("/api", authRoutes);
app.use("/api", uploadRoutes);
//Listening Port
const port = 8000;
app.get("/", (req, res) => {
  res.send("Hello node j");
});
app.listen(port, () => {
  console.log(`Server is Connected ${port}`);
});
