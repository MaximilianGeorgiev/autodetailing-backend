const pool = require("../database.js");

const OrderService = require("../services/order");

exports.getAllOrders = (request, response) => {
    OrderService.getAllOrders(request, response);
};

exports.getOrderById = (request, response) => {
    OrderService.getOrderById(request, response);
};

exports.getOrdersForCustomer = (request, response) => {
    OrderService.getOrdersForCustomer(request, response);
};

exports.getOrderProducts = (request, response) => {
    OrderService.getOrderProducts(request, response);
};

exports.getOrdersForProduct = (request, response) => {
    OrderService.getOrdersForProduct(request, response);
};

exports.updateOrder = (request, response) => {
    OrderService.updateOrder(request, response);
};

exports.createOrder = (request, response) => {
    OrderService.createOrder(request, response);
};

exports.deleteOrder = async (request, response) => {
    OrderService.deleteOrder(request, response);
};

exports.deleteOrdersWithProduct = (request, response) => {
    OrderService.deleteOrdersWithProduct(request, response);
};

exports.deleteOrdersForUser = async (request, response) => {
    OrderService.deleteOrdersForUser(request, response);
};

exports.addProduct = (request, response) => {
    OrderService.addProduct(request, response);
};