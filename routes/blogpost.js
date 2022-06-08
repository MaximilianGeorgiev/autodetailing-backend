const express = require('express');
const router = express.Router();

const BlogController = require("../controllers/blogpost.js");

router.route('/')
.get(BlogController.getAllBlogs)
.post(BlogController.createBlog);

router.get('/id/:id', ServiceController.getBlogById);
router.get('/title/:title', ServiceController.getBlogByTitle);
router.get('/author/:id', ServiceController.getBlogByAuthorId);
router.get('/delete/:id', ServiceController.deleteBlog); 

router.get('/pictures/:id', ServiceController.getBlogPictures);

router.post('/picture/add', ServiceController.addPicture);
router.post('/picture/remove', ServiceController.removePicture);

router.put('/:id', ServiceController.updateBlog);

module.exports = router;