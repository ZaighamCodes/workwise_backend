const CartItem = require('../models/CartItem');
const Product = require('../models/Product');

exports.addToCart = async (req, res) => {
  const { productId, quantity } = req.body;
  try {
    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    let cartItem = await CartItem.findOne({
      where: { productId, userId: req.user.id }
    });
    if (cartItem) {
      cartItem.quantity += quantity;
      await cartItem.save();
    } else {
      cartItem = await CartItem.create({
        productId,
        userId: req.user.id,
        productName: product.name,
        price: product.price,
        productImage: product.image,
        discount: product.discount,
        quantity
      });
    }

    res.status(201).json(cartItem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.getCart = async (req, res) => {
  try {
    const cartItems = await CartItem.findAll({
      where: { userId: req.user.id },
      include: [{ model: Product, attributes: ['name', 'price'] }]
    });
    res.status(200).json(cartItems);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.removeFromCart = async (req, res) => {
  const { id } = req.params;
  try {
    const cartItem = await CartItem.findOne({ where: { id, userId: req.user.id } });
    if (!cartItem) {
      return res.status(404).json({ error: "Cart item not found" });
    }
    await cartItem.destroy();
    res.status(200).json({ message: "Cart item removed" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.clearCart = async (req, res) => {
  try {
    await CartItem.destroy({ where: { userId: req.user.id } });
    res.status(200).json({ message: "All items removed from the cart" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
