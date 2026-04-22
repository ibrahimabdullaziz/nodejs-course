const path = require("path");

const express = require("express");

const adminController = require("../controllers/admin");
const isAuth = require("../middleware/isAuth");
const { check } = require("express-validator");

const router = express.Router();

// /admin/add-product => GET
router.get("/add-product", isAuth, adminController.getAddProduct);

// /admin/products => GET
router.get("/products", isAuth, adminController.getProducts);

// /admin/add-product => POST
router.post(
  "/add-product",
  [
    isAuth,
    check("title")
      .isString()
      .isLength({ min: 1 })
      .withMessage("text should be string "),
    check("imageUrl")
      .isURL()
      .withMessage("image should be in URL correct formatting "),
    check("price").isNumeric().withMessage("price should be numeric"),
    check("description")
      .isString()
      .isLength({ min: 3 })
      .withMessage("description is required![at least 3 chars] "),
  ],
  adminController.postAddProduct,
);

router.get("/edit-product/:productId", isAuth, adminController.getEditProduct);

router.post(
  "/edit-product",
  [
    isAuth,
    check("title")
      .isString()
      .isLength({ min: 1 })
      .withMessage("text should be string "),
    check("imageUrl")
      .isURL()
      .withMessage("image should be in URL correct formatting "),
    check("price").isNumeric().withMessage("price should be numeric"),
    check("description")
      .isString()
      .isLength({ min: 3 })
      .withMessage("description is required![at least 3 chars] "),
  ],
  adminController.postEditProduct,
);

router.post("/delete-product", isAuth, adminController.postDeleteProduct);

module.exports = router;
