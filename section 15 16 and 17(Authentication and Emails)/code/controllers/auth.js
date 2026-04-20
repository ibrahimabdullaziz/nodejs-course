const User = require("../models/user");
const crypt = require("bcryptjs");

exports.getLogin = (req, res, next) => {
  let message = req.flash("login-error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    isAuthenticated: false,
    errorMessage: message,
  });
};

exports.getSignup = (req, res, next) => {
  let message = req.flash("signup-error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("auth/signup", {
    path: "/signup",
    pageTitle: "Signup",
    isAuthenticated: false,
    errorMessage: message,
  });
};

exports.postLogin = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        req.flash("login-error", "Sorry, Can not find this email!");
        return res.redirect("/login");
      }
      return crypt.compare(password, user.password).then((doMatch) => {
        if (doMatch) {
          req.session.isLoggedIn = true;
          req.session.user = user;
          req.session.save((err) => {
            console.log("LOGIN SUCCESSFUL");
            res.redirect("/");
          });
        } else {
          req.flash("login-error", "Passwords should match!");
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
  const { email, password, confirmPassword } = req.body;

  User.findOne({ email: email })
    .then((userDoc) => {
      if (userDoc) {
        req.flash("signup-error", "this email alreday exists!");
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
