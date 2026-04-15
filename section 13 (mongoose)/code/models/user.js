const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const User = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  cart: {
    items: [
      {
        productId: {
          type: mongoose.Types.ObjectId,
          ref: "product",
          required: true,
        },
        quantity: { type: Number, required: true },
      },
    ],
  },
});

module.exports = mongoose.model("User", User);

// const getDb = require("../util/database").getDb;
// const mongodb = require("mongodb");

// class User {
//   constructor(userName, email, cart, id) {
//     this.name = userName;
//     this.email = email;
//     this.cart = cart; //{items:[]}
//     this._id = id;
//   }

//   save() {
//     const db = getDb();
//     return db.collection("users")
//       .insertOne(this)
//       .then((result) => {
//         console.log("DONE");
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   }

//   addToCart(product) {
//     if (!this.cart) {
//       this.cart = { items: [] };
//     }

//     const cartProductIndex = this.cart.items.findIndex((prod) => {
//       return prod.productId.toString() === product._id.toString();
//     });

//     let newQuantity = 1;
//     let updatedCartItems = [...this.cart.items];

//     if (cartProductIndex >= 0) {
//       newQuantity = updatedCartItems[cartProductIndex].quantity + 1;
//       updatedCartItems[cartProductIndex].quantity = newQuantity;
//     } else {
//       updatedCartItems.push({
//         productId: new mongodb.ObjectId(product._id),
//         quantity: newQuantity,
//       });
//     }

//     const updatedCart = {
//       items: updatedCartItems,
//     };

//     const db = getDb();

//     return db
//       .collection("users")
//       .updateOne(
//         { _id: new mongodb.ObjectId(this._id) },
//         { $set: { cart: updatedCart } },
//       );
//   }

//   getCart() {
//     const db = getDb();

//     const productIds = this.cart.items.map((i) => {
//       return i.productId;
//     });

//     return db
//       .collection("products")
//       .find({ _id: { $in: productIds } })
//       .toArray()
//       .then((products) => {
//         return products.map((product) => {
//           const item = this.cart.items.find((item) => {
//             return item.productId.toString() === product._id.toString();
//           });
//           return {
//             ...product,
//             id: product._id,
//             quantity: item ? item.quantity : 0,
//           };
//         });
//       })
//       .catch((err) => {
//         console.log(err);
//         return [];
//       });
//   }

//   deleteItem(productId) {
//     const updatedCartItems = this.cart.items.filter((i) => {
//       return i.productId.toString() !== productId.toString();
//     });

//     const db = getDb();
//     return db
//       .collection("users")
//       .updateOne(
//         { _id: new mongodb.ObjectId(this._id) },
//         { $set: { cart: { items: updatedCartItems } } },
//       )
//       .then((result) => result)
//       .catch((err) => {
//         console.log(err);
//       });
//   }

//   static findById(userId) {
//     const db = getDb();
//     return db
//       .collection("users")
//       .findOne({ _id: new mongodb.ObjectId(userId) })
//       .then((user) => {
//         console.log("DONE", user);
//         return user;
//       })
//       .catch((err) => {
//         console.log("Error finding user:", err);
//         return null;
//       });
//   }

//   addOrder() {
//     const db = getDb();
//     const productIds = this.cart.items.map((i) => i.productId);

//     return db
//       .collection("products")
//       .find({ _id: { $in: productIds } })
//       .toArray()
//       .then((products) => {
//         const orderItems = this.cart.items.map((item) => {
//           const product = products.find((p) => p._id.toString() === item.productId.toString());
//           return {
//             product: product,
//             quantity: item.quantity,
//           };
//         });

//         return db
//           .collection("orders")
//           .insertOne({
//             userId: new mongodb.ObjectId(this._id),
//             items: orderItems,
//             date: new Date(),
//           })
//           .then((result) => {
//             this.cart = { items: [] };
//             return db
//               .collection("users")
//               .updateOne(
//                 { _id: new mongodb.ObjectId(this._id) },
//                 { $set: { cart: { items: [] } } }
//               );
//           });
//       })
//       .catch((err) => console.log(err));
//   }

//   static getOrders(userId) {
//     const db = getDb();
//     return db
//       .collection("orders")
//       .find({ userId: new mongodb.ObjectId(userId) })
//       .toArray()
//       .then((orders) => {
//         return orders;
//       })
//       .catch((err) => {
//         console.log(err);
//         return [];
//       });
//   }
// }

// module.exports = User;
