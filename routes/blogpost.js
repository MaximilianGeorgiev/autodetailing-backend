const express = require('express');
const router = express.Router();

const BlogController = require("../controllers/blogpost.js");
const AuthUtils = require("../utils/auth.js");

router.get('/', BlogController.getAllBlogs);
router.post('/', AuthUtils.validateToken, BlogController.createBlog);

router.get('/id/:id', BlogController.getBlogById);
router.get('/title/:title', BlogController.getBlogByTitle);
router.get('/author/:id', AuthUtils.validateToken, BlogController.getBlogByAuthorId);
router.get('/delete/:id', AuthUtils.validateToken, BlogController.deleteBlog); 

router.get('/pictures/:id', BlogController.getBlogPictures);

router.post('/picture/add', AuthUtils.validateToken, BlogController.addPicture);
router.post('/picture/remove', AuthUtils.validateToken, BlogController.removePicture);

router.put('/:id', AuthUtils.validateToken, BlogController.updateBlog);

module.exports = router;