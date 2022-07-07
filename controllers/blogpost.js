const pool = require("../database.js");
const BlogService = require("../services/blogpost");

exports.getAllBlogs = (request, response) => {
    BlogService.getAllBlogs(request, response);
};

exports.getBlogById = (request, response) => {
    BlogService.getBlogById(request, response);
};

exports.getBlogByTitle = (request, response) => {
    BlogService.getBlogByTitle(request, response);
};

exports.getBlogByAuthorId = (request, response) => {
    BlogService.getBlogByAuthorId(request, response);
};

exports.getBlogPictures = (request, response) => {
    BlogService.getBlogPictures(request, response);
};

exports.deleteBlog = (request, response) => {
    BlogService.deleteBlog(request, response);
};

exports.deleteBlogsForUser = (request, response) => {
    BlogService.deleteBlogsForUser(request, response);
};

exports.createBlog = (request, response) => {
    BlogService.createBlog(request, response);
};

exports.updateBlog = (request, response) => {
    BlogService.updateBlog(request, response);
};

exports.addPicture = (request, response) => {
    BlogService.addPicture(request, response);
};

exports.removePicture = (request, response) => {
    BlogService.removePicture(request, response);
};

exports.removeAllPicturesForBlog = (request, response) => {
    if (!request?.body) {
        response.status(400).json({ status: "failed", reason: "missing payload for picture removing" });
        return;
    }

    if (!request?.body?.blog_id || isNaN(request?.body?.blog_id) || request?.body?.blog_id < 0) {
        response.status(404).json({ status: "failed", reason: "blog_id is invalid" });
        return;
    }

    pool.query('DELETE FROM "AutoDetailing"."EntityPicture" WHERE blog_id = $1', [request.body.blog_id])
        .then((res) => response.status(200).json({ status: "success" }))
        .catch((err) => response.status(500).json({ status: "failed", reason: err.detail }));
};