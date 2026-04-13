const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");

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

mongoose
  .connect(
    "mongodb+srv://fantasy26124_db_user:uaQyBC5UdWVqBI4V@cluster0.iqqljmr.mongodb.net/?appName=Cluster0",
  )
  .then((result) => {
    app.listen("3000");
    console.log("CONNECTED!");
  })
  .catch((err) => console.log(err));
