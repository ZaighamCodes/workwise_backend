const express = require('express');
const { signup, login } = require('../controllers/userController');
const router = express.Router();

router.post('/register', signup); // Register route - No authentication required
router.post('/login', login);     // Login route - No authentication required

module.exports = router;
