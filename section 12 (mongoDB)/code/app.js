const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const connectClient = require("./util/database").connectClient;

const errorController = require("./controllers/error");

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const User = require("./models/user");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  console.log("Finding user...");
  User.findById("69dc2915894ec0af28dd95f4")
    .then((user) => {
      if (!user) {
        return next();
      }
      console.log("User found:", user);
      req.user = new User(user.name, user.email, user.cart, user._id);
      next();
    })
    .catch((err) => {
      console.log("Error finding user:", err);
      next();
    });
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

connectClient(() => {
  app.listen(3000);
});
