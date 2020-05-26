const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  resetToken: String,
  resetTokenExpiration: Date,
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