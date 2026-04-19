const User = require("../models/user");
const crypt = require("bcryptjs");

exports.getLogin = (req, res, next) => {
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    isAuthenticated: false,
  });
};

exports.getSignup = (req, res, next) => {
  res.render("auth/signup", {
    path: "/signup",
    pageTitle: "Signup",
    isAuthenticated: false,
  });
};

exports.postLogin = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        return res.redirect("/login");
      }
      return crypt.compare(password, user.password).then((doMatch) => {
        if (doMatch) {
          req.session.isLoggedIn = true;
          req.session.user = user;
          req.session.save((err) => {
            console.log(err);
            res.redirect("/");
          });
        } else {
          res.redirect("/login");
        }
      });
    })
    .catch((err) => {
      console.log("ERROR!.....", err);
      return res.redirect("/login");
    });
};

exports.postSignup = (req, res, next) => {
  const { email, password, confirmedPassword } = req.body;

  User.findOne({ email: email })
    .then((userDoc) => {
      if (userDoc) {
        return res.redirect("/signup");
      }
      return crypt
        .hash(password, 12)
        .then((cryptedPassword) => {
          const user = new User({
            email: email,
            password: cryptedPassword,
            cart: { items: [] },
          });

          return user.save();
        })
        .then((result) => {
          console.log("USER CREATED!");
          res.redirect("/login");
        });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    console.log(err);
    res.redirect("/");
  });
};
