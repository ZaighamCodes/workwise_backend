const express = require('express');
const {
  createProduct,
  getProducts,
  updateProduct,
  deleteProduct,
  getProductById,
  getAllProducts
} = require("../controllers/productController");
const authenticate = require('../middleware/authenticate');
const router = express.Router();
router.get('/allproducts', getAllProducts);
router.use(authenticate);
router.post('/products', createProduct);
router.get('/products', getProducts);
router.get('/products/:id', getProductById);
router.put('/products/:id', updateProduct);
router.delete('/products/:id', deleteProduct);

module.exports = router;
