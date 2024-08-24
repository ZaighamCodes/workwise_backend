// routes/cartRoutes.js
const express = require('express');
const {
  addToCart,
  getCart,
  removeFromCart,
  clearCart
} = require("../controllers/cartController");
const router = express.Router();




router.post('/cart', addToCart);
router.get('/cart', getCart);
router.delete('/cart/:id', removeFromCart);
router.delete('/cart', clearCart);

module.exports = router;
