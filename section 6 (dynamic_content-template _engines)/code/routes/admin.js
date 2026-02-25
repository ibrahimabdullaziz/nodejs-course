const path = require("path");

const express = require("express");

const router = express.Router();
const dirName = require("../util/path");
const products = [];

router.get("/add-product", (req, res, next) => {
  // res.sendFile(path.join(dirName, "views", "add-product.html"));
  res.render("add-product", {
    pageTitle: "add product",
    path: "/admin/add-product",
    productCss: true,
    formCss: true,
    productActive: true,
  });
});

router.post("/add-product", (req, res, next) => {
  products.push({ title: req.body.title });
  res.redirect("/");
});

exports.router = router;
exports.products = products;
