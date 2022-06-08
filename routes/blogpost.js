const express = require('express');
const router = express.Router();

const BlogController = require("../controllers/blogpost.js");

router.route('/')
.get(BlogController.getAllBlogs)
.post(BlogController.createBlog);

router.get('/id/:id', BlogController.getBlogById);
router.get('/title/:title', BlogController.getBlogByTitle);
router.get('/author/:id', BlogController.getBlogByAuthorId);
router.get('/delete/:id', BlogController.deleteBlog); 

router.get('/pictures/:id', BlogController.getBlogPictures);

router.post('/picture/add', BlogController.addPicture);
router.post('/picture/remove', BlogController.removePicture);

router.put('/:id', BlogController.updateBlog);

module.exports = router;