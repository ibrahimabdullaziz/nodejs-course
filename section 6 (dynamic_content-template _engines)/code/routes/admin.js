const path = require("path");

const express = require("express");

const router = express.Router();
const dirName = require("../util/path");
const products = [];

router.get("/add-product", (req, res, next) => {
  res.sendFile(path.join(dirName, "views", "add-product.html"));
});

router.post("/add-product", (req, res, next) => {
  products.push({ title: req.body.title });
  res.redirect("/");
});

exports.router = router;
exports.products = products;
