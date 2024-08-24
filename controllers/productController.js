// controllers/productController.js
const Product = require('../models/Product');
const multer = require('multer');
const path = require('path');

// Set up multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/images');
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const filename = Date.now() + ext;
    cb(null, filename);
  }
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    if (['.jpg', '.jpeg', '.png'].includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only jpg, jpeg, and png are allowed.'));
    }
  }
}).single('image');
exports.createProduct = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }

    const { name, category, price, description, discount } = req.body;
    const image = req.file ? req.file.path : null;
    try {
      const product = await Product.create({
        name,
        category,
        price,
        description,
        discount,
        image,
        userId: req.user.id
      });
      res.status(201).json(product);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: error.message });
    }
  });
};

exports.getProducts = async (req, res) => {
  try {
    const products = await Product.findAll({ where: { userId: req.user.id } });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, category, price, description, discount } = req.body;

  try {
    const product = await Product.findOne({ where: { id, userId: req.user.id } });
    
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Handle image upload if a new file is provided
    upload(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ error: err.message });
      }

      // Update product fields
      product.name = name || product.name;
      product.category = category || product.category;
      product.price = price || product.price;
      product.description = description || product.description;
      product.discount = discount || product.discount;
      if (req.file) {
        product.image = req.file.path; // Update image if a new one is provided
      }

      // Save changes
      await product.save();
      res.status(200).json(product);
    });
  } catch (error) {
    console.error(`Error updating product: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
};


exports.deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await Product.findOne({ where: { id, userId: req.user.id } });

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    console.log(`Deleting product: ${product.name}, ID: ${product.id}`);
    if (product.image && !product.image.startsWith('http')) { 
      const fs = require('fs');
      try {
        if (fs.existsSync(product.image)) {
          fs.unlinkSync(product.image); 
          console.log(`Image file deleted: ${product.image}`);
        } else {
          console.log(`Image file not found: ${product.image}`);
        }
      } catch (fileError) {
        console.error(`Error deleting image file: ${fileError.message}`);
      }
    } else {
      console.log('Image is a URL or not provided, skipping deletion of image file.');
    }
    await product.destroy();
    res.status(200).json({ message: "Product deleted" });

  } catch (error) {
    console.error(`Error deleting product: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
};






exports.getProductById = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await Product.findOne({ where: { id, userId: req.user.id } });
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};




exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.findAll(); // Fetch all products from the database
    res.status(200).json(products);
  } catch (error) {
    console.error(`Error fetching products: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
};