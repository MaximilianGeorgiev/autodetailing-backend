const pool = require("../database.js");
const StringUtils = require("../utils/string.js");

exports.getAllCategories = (request, response) => {
    pool.query('SELECT * FROM "AutoDetailing"."Category"')
        .then((res) => response.status(200).json({ status: "success", payload: res.rows }))
        .catch((err) => response.status(500).json({ status: "failed", reason: err }));
};

exports.getCategoryById = (request, response) => {
    if (!request?.params?.id || isNaN(request?.params?.id) || request?.params?.id < 0) {
        response.status(404).json({ status: "failed", reason: "category_id is invalid" });
        return;
    }

    pool.query('SELECT * FROM "AutoDetailing"."Category" WHERE category_id = $1', [request.params.id])
        .then((res) => response.status(200).json({ status: "success", payload: res.rows }))
        .catch((err) => response.status(500).json({ status: "failed", reason: err }));
};

exports.getCategoryByName = (request, response) => {
    // it is likely that the query comes with a lower case and that would lead to a false query and no results will be
    // found. The roles in the database start with an upper case and need to be transformed.
    pool.query('SELECT * FROM "AutoDetailing"."Category" WHERE category_name = $1',
        [StringUtils.capitalizeFirstChar(request.params.name)])
        .then((res) => response.status(200).json({ status: "success", payload: res.rows }))
        .catch((err) => response.status(500).json({ status: "failed", reason: err }));
};

exports.createCategory = (request, response) => {
    if (!request?.body || !request?.body?.name || request?.body?.name === "") {
        response.status(400).json({ status: "failed", reason: "category_name is invalid" });
        return;
    }

    pool.query('INSERT INTO "AutoDetailing"."Category" (category_name) VALUES ($1)', [request.body.name])
        .then((res) => response.status(200).json({ status: "success", category: res.rows[0] }))
        .catch((err) => response.status(500).json({ status: "failed", reason: err }));
};

exports.updateCategory = (request, response) => {
    if (!request?.params?.id || isNaN(request?.params?.id) || request?.params?.id < 0) {
        response.status(400).json({ status: "failed", reason: "category_id is invalid" });
        return;
    }

    if (!request?.body || !request?.body?.name || request?.body?.name === "") {
        response.status(400).json({ status: "failed", reason: "category_name is invalid" });
        return;
    }

    pool.query('UPDATE "AutoDetailing"."Category" set category_name = $1 WHERE category_id = $2', [request.body.name, request.params.id])
        .then((res) => response.status(200).json({ status: "success" }))
        .catch((err) => response.status(500).json({ status: "failed" }));
};

exports.deleteCategory = (request, response) => {
    if (!request?.params?.id || isNaN(request?.params?.id) || request?.params?.id < 0) {
        response.status(400).json({ status: "failed", reason: "category_id is invalid" });
        return;
    }

    pool.query('DELETE FROM "AutoDetailing"."Category" WHERE category_id = $1', [request.params.id])
        .then((res) => response.status(200).json({ status: "success" }))
        .catch((err) => response.status(500).json({ status: "failed" }));
};