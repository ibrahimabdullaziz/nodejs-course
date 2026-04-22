const User = require("../models/user");
const crypt = require("bcryptjs");
const crypto = require("crypto");

const { sendEmail } = require("../util/email");
const user = require("../models/user");
const { validationResult } = require("express-validator");

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
    oldInputs: {
      email: "",
      password: "",
    },
    validationErrors: [],
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
    oldInputs: {
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationErrors: [],
  });
};

exports.postLogin = (req, res, next) => {
  const { email, password } = req.body;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.log(errors);
    return res.status(422).render("auth/login", {
      path: "/login",
      pageTitle: "login",
      isAuthenticated: false,
      errorMessage: errors.array()[0].msg,
      oldInputs: {
        email: email,
        password: password,
      },
      validationErrors: errors.array(),
    });
  }

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
      console.log("ERROR", err);
      return res.redirect("/login");
    });
};

exports.postSignup = (req, res, next) => {
  const { email, password, confirmPassword } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    return res.status(422).render("auth/signup", {
      path: "/signup",
      pageTitle: "signup",
      isAuthenticated: false,
      errorMessage: errors.array()[0].msg,
      oldInputs: {
        email: email,
        password: password,
        confirmPassword: confirmPassword,
      },
      validationErrors: errors.array(),
    });
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
      const html = `
            <h1>Hi, welcome to our shop!</h1>
      <p>Thank you for signing up. We're glad to have you!</p>
      <p>Start exploring our products and enjoy your shopping experience.</p>
      <br/>
      <p>Best regards,<br/>The Shop Team</p>
          `;
      sendEmail(email, html).catch((err) =>
        console.log("Email failed to send:", err.message),
      );
      console.log("USER CREATED!");
      res.redirect("/login");
    });
};

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    console.log(err);
    res.redirect("/");
  });
};

exports.getResetPassword = (req, res, next) => {
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("auth/reset", {
    path: "/reset",
    pageTitle: "reset password",
    isAuthenticated: false,
    errorMessage: message,
  });
};

exports.postResetPassword = (req, res, next) => {
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
      return res.redirect("/reset");
    }

    const token = buffer.toString("hex");

    User.findOne({ email: req.body.email })
      .then((user) => {
        if (!user) {
          req.flash("error", "We can not find this email user!");
          return res.redirect("/reset");
        }
        user.resetToken = token;
        user.expResetToken = Date.now() + 3600000;
        return user.save().then((result) => {
          res.redirect("/");

          const resetLink = `http://localhost:3000/reset/${token}`;
          console.log("\\n============================");
          console.log("PASSWORD RESET LINK:");
          console.log(resetLink);
          console.log("============================\\n");

          const html = `
      <p>there is where you can reset your password</p>
      <h3>click this <a href="\${resetLink}">link</a> to create the new one</h3>
      <p>this link will be invaild in one hour</p>
      `;
          sendEmail(req.body.email, html).catch((err) =>
            console.log("Email failed to send:", err.message),
          );
        });
      })
      .catch((err) => console.log(err));
  });
};

exports.getNewPassword = (req, res, next) => {
  const token = req.params.token;
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }

  User.findOne({ resetToken: token, expResetToken: { $gt: Date.now() } })
    .then((user) => {
      if (!user) {
        req.flash("error", "Token is invalid or has expired.");
        return res.redirect("/reset");
      }
      res.render("auth/new-password", {
        path: "/new-password",
        pageTitle: "reset password",
        isAuthenticated: false,
        errorMessage: message,
        userId: user._id.toString(),
        token: token,
      });
    })
    .catch((err) => errorMessage500());
};

exports.postNewPassword = (req, res, next) => {
  const token = req.body.token;
  const newPassword = req.body.password;
  const userId = req.body.userId;
  let resetUser;

  User.findOne({
    resetToken: token,
    expResetToken: { $gt: Date.now() },
    _id: userId,
  })
    .then((user) => {
      if (!user) {
        req.flash("error", "Token has expired or user not found!");
        return res.redirect("/reset");
      }
      resetUser = user;
      return crypt.hash(newPassword, 12);
    })
    .then((hashedPassword) => {
      if (!hashedPassword) return; // In case the previous redirect happened
      resetUser.password = hashedPassword;
      resetUser.resetToken = undefined;
      resetUser.expResetToken = undefined;
      return resetUser.save();
    })
    .then((result) => {
      if (result) {
        res.redirect("/login");
      }
    })
    .catch((err) => errorMessage500());
};
