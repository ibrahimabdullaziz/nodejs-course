const express = require("express");
const crypt = require("bcryptjs");

const authController = require("../controllers/auth");
const { check, body } = require("express-validator");
const User = require("../models/user");

const router = express.Router();

router.get("/login", authController.getLogin);

router.get("/signup", authController.getSignup);

router.post(
  "/login",
  [
    body("email")
      .isEmail()
      .withMessage("Please enter a valid email address.")
      .normalizeEmail(),

    body("password", "Password has to be valid.")
      .isLength({ min: 5 })
      .isAlphanumeric()
      .trim(),
  ],

  authController.postLogin,
);

router.post(
  "/signup",
  [
    check("email")
      .isEmail()
      .withMessage("please enter a valid email")
      .custom((value) => {
        // if (value === "test@gmail.com") {
        //   throw new error("this email is forbidden!");
        // }
        // return true;

        return User.findOne({ email: value }).then((userDoc) => {
          if (userDoc) {
            return Promise.reject("this email is already exists!");
          }
        });
      }),
    body(
      "password",
      "password should be text / number and at least 5 characters",
    )
      .isLength({ min: 5 })
      .isAlphanumeric(),
    body("confirmedPassword").custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("passwords have to match!");
      }
      return true;
    }),
  ],
  authController.postSignup,
);

router.post("/logout", authController.postLogout);

router.get("/reset", authController.getResetPassword);

router.post("/reset", authController.postResetPassword);

router.get("/reset/:token", authController.getNewPassword);

router.post("/reset/:token", authController.postNewPassword);

module.exports = router;
