const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
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
          type: Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        qty: { type: Number, required: true },
      },
    ],
  },
});

userSchema.methods.addToCart = function (product) {
  const cartProduct = this.cart
    ? this.cart.items.findIndex((cp) => {
        return cp.productId.toString() === product._id.toString();
      })
    : null;

  let newQty = 1;
  const updatedCartItems = this.cart ? [...this.cart.items] : [];

  if (cartProduct !== undefined && cartProduct >= 0) {
    newQty = this.cart.items[cartProduct].qty + 1;
    updatedCartItems[cartProduct].qty = newQty;
  } else {
    updatedCartItems.push({
      productId: product._id,
      qty: newQty,
    });
  }

  const updatedCart = {
    items: updatedCartItems,
  };

  this.cart = updatedCart;
  return this.save();
};

userSchema.methods.deleteItemFromCart = function (productId) {
  const updatedCartItems = this.cart.items.filter((i) => {
    return i.productId.toString() !== productId.toString();
  });

  this.cart.items = updatedCartItems;

  return this.save();
};

userSchema.methods.addOrder = function () {
  this.orders.push({
    items: this.cart.items.map((i) => {
      return {
        title: i.title,
        price: i.price,
        description: i.description,
        imageUrl: i.imageUrl,
      };
    }),
  });
};

userSchema.methods.clearCart = function () {
  this.cart = { items: [] };
  return this.save();
};

module.exports = mongoose.model('User', userSchema);

// class User {
//   constructor(username, email, cart, id) {
//     this.name = username;
//     this.email = email;
//     this.cart = cart;
//     this.id = id;
//   }

//   save() {
//     const db = getDb();

//     return db.collection('users').insertOne(this);
//   }

//   getCart() {
//     const db = getDb();
//     const productIds = this.cart.items.map((i) => i.productId);
//     return db
//       .collection('products')
//       .find({ _id: { $in: productIds } })
//       .toArray()
//       .then((products) => {
//         return products.map((p) => {
//           return {
//             ...p,
//             qty: this.cart.items.find((i) => {
//               return i.productId.toString() === p._id.toString();
//             }).qty,
//           };
//         });
//       });
//   }

//   deleteItemFromCart(productId) {
//     const db = getDb();

//     const updatedCartItems = this.cart.items.filter((i) => {
//       return i.productId.toString() !== productId.toString();
//     });

//     return db
//       .collection('users')
//       .updateOne(
//         { _id: new mongoDb.ObjectID(this.id) },
//         { $set: { cart: { items: updatedCartItems } } }
//       );
//   }

//   addToCart(product) {
//     const cartProduct = this.cart
//       ? this.cart.items.findIndex((cp) => {
//           return cp.productId.toString() === product._id.toString();
//         })
//       : null;

//     let newQty = 1;
//     const updatedCartItems = this.cart ? [...this.cart.items] : [];

//     if (cartProduct !== undefined && cartProduct >= 0) {
//       newQty = this.cart.items[cartProduct].qty + 1;
//       updatedCartItems[cartProduct].qty = newQty;
//     } else {
//       updatedCartItems.push({
//         productId: new mongoDb.ObjectID(product._id),
//         qty: newQty,
//       });
//     }

//     const db = getDb();
//     const updatedCart = {
//       items: updatedCartItems,
//     };
//     console.log(updatedCart);
//     return db
//       .collection('users')
//       .updateOne(
//         { _id: new mongoDb.ObjectID(this.id) },
//         { $set: { cart: updatedCart } }
//       );
//   }

//   addOrder() {
//     const db = getDb();
//     return this.getCart()
//       .then((products) => {
//         const order = {
//           items: products,
//           user: {
//             _id: new mongoDb.ObjectID(this.id),
//             name: this.name,
//           },
//         };
//         return db.collection('orders').insertOne(order);
//       })
//       .then((result) => {
//         this.cart = { items: [] };

//         return db
//           .collection('users')
//           .updateOne(
//             { _id: new mongoDb.ObjectID(this.id) },
//             { $set: { cart: { items: [] } } }
//           );
//       });
//   }

//   getOrders() {
//     const db = getDb();
//     console.log(new mongoDb.ObjectID(this.id))

//     return (
//       db
//         .collection('orders')
//         // .find()
//         .find({ 'user._id': new mongoDb.ObjectID(this.id) })
//         .toArray()
//     );
//   }

//   static findById(userId) {
//     const db = getDb();
//     return db
//       .collection('users')
//       .findOne({ _id: mongoDb.ObjectID(userId) })
//       .then((user) => {
//         return user;
//       })
//       .catch((err) => console.log(err));
//   }
// }
// module.exports = User;
