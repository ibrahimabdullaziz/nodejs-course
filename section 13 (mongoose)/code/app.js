const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");

dotenv.config();

const errorController = require("./controllers/error");

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const User = require("./models/user");
const { default: mongoose } = require("mongoose");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

// app.use((req, res, next) => {
//   console.log("Finding user...");
//   User.findById("69dc2915894ec0af28dd95f4")
//     .then((user) => {
//       if (!user) {
//         return next();
//       }
//       console.log("User found:", user);
//       req.user = new User(user.name, user.email, user.cart, user._id);
//       next();
//     })
//     .catch((err) => {
//       console.log("Error finding user:", err);
//       next();
//     });
// });

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

const dbName = process.env.DB_NAME ? `/${process.env.DB_NAME}` : "";
const dbHost = process.env.DB_HOST || process.env.DB_CLUSTER;
const dbPassword = process.env.DB_PASSWORD
  ? encodeURIComponent(process.env.DB_PASSWORD)
  : "";

const MONGODB_URI =
  process.env.MONGODB_URI ||
  `mongodb+srv://${process.env.DB_USER}:${dbPassword}@${dbHost}${dbName}?retryWrites=true&w=majority`;

if (
  !process.env.MONGODB_URI &&
  !(process.env.DB_USER && process.env.DB_PASSWORD && dbHost)
) {
  throw new Error(
    "MongoDB connection details are not set. Define MONGODB_URI or DB_USER, DB_PASSWORD, and DB_CLUSTER/DB_HOST in environment variables.",
  );
}

console.log("Connecting to MongoDB URI:", MONGODB_URI);

mongoose
  .connect(MONGODB_URI, {
    serverSelectionTimeoutMS: 30000,
    family: 4,
  })
  .then((result) => {
    app.listen("3000");
    console.log("CONNECTED!");
  })
  .catch((err) => console.log(err));
