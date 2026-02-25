const products = [];

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
  products.push({ title: req.body.title });
  res.redirect("/");
};

exports.getProducts = (req, res, next) => {
  res.render("shop", {
    products: products,
    pageTitle: "Shop",
    path: "/",
    hasProducts: products.length > 0,
    productCss: true,
    shopActive: true,
  });
};
