const express = require('express');
const router = express.Router();

const ProductController = require('../controllers/product.js');

router.route('/')
.get(ProductController.getAllProducts)
.post(ProductController.createProduct);

router.get('/id/:id', ProductController.getProductById);
router.get('/title/:title', ProductController.getProductByTitle);
router.get('/delete/:id', ProductController.deleteProduct); 

router.put('/:id', ProductController.updateProduct);

module.exports = router;