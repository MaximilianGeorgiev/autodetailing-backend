const pool = require("../database.js");
const StringUtils = require("../utils/string.js");

const CategoryService = require("../services/category");

exports.getAllCategories = (request, response) => {
    CategoryService.getAllCategories(request, response);
};

exports.getCategoryById = (request, response) => {
    CategoryService.getCategoryById(request, response);
};

exports.getCategoryByName = (request, response) => {
    CategoryService.getCategoryByName(request, response);
};

exports.createCategory = (request, response) => {
    CategoryService.createCategory(request, response);
};

exports.updateCategory = (request, response) => {
    CategoryService.updateCategory(request, response);
};

exports.deleteCategory = (request, response) => {
    CategoryService.deleteCategory(request, response);
};