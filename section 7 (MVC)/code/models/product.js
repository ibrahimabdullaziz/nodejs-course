const path = require("path");
const fs = require("fs");

const p = path.join(
  path.dirname(require.main.filename),
  "data",
  "products.json",
);

const getProductsFromFile = (cb) => {
  fs.readFile(p, (err, fileContent) => {
    if (err) {
      return cb([]);
    }
    try {
      cb(JSON.parse(fileContent));
    } catch (e) {
      cb([]);
    }
  });
};

class Product {
  constructor(title) {
    this.title = title;
  }

  addProduct() {
    getProductsFromFile((products) => {
      products.push(this);
      fs.writeFile(p, JSON.stringify(products), (err) => {
        if (err) console.log("Error saving file:", err);
      });
    });
  }

  static fetchAllProducts(cb) {
    getProductsFromFile(cb);
  }
}

module.exports = Product;
