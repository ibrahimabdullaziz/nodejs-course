const Product = require("../models/product");

exports.getAddProduct = (req, res, next) => {
  res.render("add-product", {
    pageTitle: "add product",
    path: "/admin/add-product",
    productCss: true,
    formCss: true,
    productActive: true,
  });
};

exports.postAddProduct = (req, res, next) => {
  const product = new Product(req.body.title);
  product.addProduct();
  res.redirect("/");
};

exports.getProducts = (req, res, next) => {
  Product.fetchAllProducts((products) => {
    res.render("shop", {
      products: products,
      pageTitle: "Shop",
      path: "/",
      hasProducts: products.length > 0,
      productCss: true,
      shopActive: true,
    });
  });
};
