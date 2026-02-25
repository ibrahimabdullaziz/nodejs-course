const path = require("path");

const express = require("express");

const router = express.Router();
const dirName = require("../util/path");
const adminData = require("./admin");

router.get("/", (req, res, next) => {
  console.log(adminData.products);
  res.render("shop", {
    products: adminData.products,
    pageTitle: "Shop",
    path: "/",
    hasProducts: adminData.products.length > 0,
    productCss: true,
    shopActive: true,
  });
});

module.exports = router;
