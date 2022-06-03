const express = require('express');
const router = express.Router();

const CategoryController = require('../controllers/category');

router.route('/')
.get(CategoryController.getAllCategories)
.post(CategoryController.createCategory);

router.get('/id/:id', CategoryController.getCategoryById);
router.get('/name/:name', CategoryController.getCategoryByName);
router.get('/delete/:id', CategoryController.deleteCategory); 

router.put('/:id', CategoryController.updateCategory);

module.exports = router;