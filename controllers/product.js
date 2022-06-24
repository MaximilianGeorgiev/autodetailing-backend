const pool = require("../database.js");

exports.getAllProducts = (request, response) => {
    pool.query('SELECT "AutoDetailing"."Product".*, category_name FROM "AutoDetailing"."Product" JOIN "AutoDetailing"."Category" ON "AutoDetailing"."Product".category_id = "AutoDetailing"."Product".category_id WHERE "AutoDetailing"."Product".category_id = "AutoDetailing"."Category".category_id')
        .then((res) => response.status(200).json({ status: "success", payload: res.rows }))
        .catch((err) => response.status(500).json({ status: "failed", reason: err }));
};

exports.getProductById = (request, response) => {
    if (!request?.params?.id || isNaN(request?.params?.id) || request?.params?.id < 0) {
        response.status(404).json({ status: "failed", reason: "product_id is invalid" });
        return;
    }

    pool.query('SELECT * FROM "AutoDetailing"."Product" JOIN "AutoDetailing"."Category" ON "AutoDetailing"."Product".category_id = "AutoDetailing"."Product".category_id WHERE "AutoDetailing"."Product".category_id = "AutoDetailing"."Category".category_id AND "AutoDetailing"."Product".product_id = $1', [request.params.id])
        .then((res) => response.status(200).json({ status: "success", payload: res.rows }))
        .catch((err) => response.status(500).json({ status: "failed", reason: err }));
};

exports.getProductByTitle = (request, response) => {
    pool.query('SELECT * FROM "AutoDetailing"."Product" JOIN "AutoDetailing"."Category" ON "AutoDetailing"."Product".category_id = "AutoDetailing"."Product".category_id WHERE "AutoDetailing"."Product".category_id = "AutoDetailing"."Category".category_id AND "AutoDetailing"."Product".product_title = $1',
        [request.params.title])
        .then((res) => response.status(200).json({ status: "success", payload: res.rows }))
        .catch((err) => response.status(500).json({ status: "failed", reason: err }));
};

exports.createProduct = (request, response) => {
    if (!request?.body) {
        response.status(400).json({ status: "failed", reason: "missing product creation parameters" });
        return;
    }

    if (!request?.body?.category_id) {
        response.status(400).json({ status: "failed", reason: "category_id is invalid" });
        return;
    }

    if (!request?.body?.description) {
        response.status(400).json({ status: "failed", reason: "product_description is invalid" });
        return;
    }

    if (!request?.body?.title) {
        response.status(400).json({ status: "failed", reason: "product_title is invalid" });
        return;
    }

    if (!request?.body?.price) {
        response.status(400).json({ status: "failed", reason: "product_price is invalid" });
        return;
    }


    pool.query('INSERT INTO "AutoDetailing"."Product" (product_title, product_description, product_price, category_id) VALUES ($1, $2, $3, $4) RETURNING *',
        [request.body.title, request.body.description, request.body.price, request.body.category_id])
        .then((res) => response.status(200).json({ status: "success", product: res.rows[0] }))
        .catch((err) => response.status(500).json({ status: "failed", reason: err.detail }));
};

exports.deleteProduct = (request, response) => {
    if (!request?.params?.id || isNaN(request?.params?.id) || request?.params?.id < 0) {
        response.status(400).json({ status: "failed", reason: "product_id is invalid" });
        return;
    }

    pool.query('DELETE FROM "AutoDetailing"."Product" WHERE product_id = $1', [request.params.id])
        .then((res) => response.status(200).json({ status: "success" }))
        .catch((err) => response.status(500).json({ status: "failed" }));
};

exports.removeAllPicturesForProduct = (request, response) => {
    if (!request?.body) {
        response.status(400).json({ status: "failed", reason: "missing payload for picture removing" });
        return;
    }

    if (!request?.body?.product_id || isNaN(request?.body?.product_id) || request?.body?.product_id < 0) {
        response.status(404).json({ status: "failed", reason: "product_id is invalid" });
        return;
    }

    pool.query('DELETE FROM "AutoDetailing"."EntityPicture" WHERE product_id = $1', [request.body.product_id])
        .then((res) => response.status(200).json({ status: "success" }))
        .catch((err) => response.status(500).json({ status: "failed", reason: err.detail }));
};

exports.updateProduct = (request, response) => {
    if (!request?.params?.id || isNaN(request?.params?.id) || request?.params?.id < 0) {
        response.status(400).json({ status: "failed", reason: "product_id is invalid" });
        return;
    }

    let setQueryString = "";

    // expects an object with a key matching the db column LITERALLY
    if (request?.body?.updateData && Object.keys(request.body.updateData).length !== 0) {
        for (const [key, value] of Object.entries(request.body.updateData))
            setQueryString = setQueryString.concat(", " + `${key} = '${value}'`);

        if (setQueryString.startsWith(",")) setQueryString = setQueryString.replace(",", "");

        pool.query(`UPDATE "AutoDetailing"."Product" set ${setQueryString} WHERE product_id = $1`, [request.params.id])
            .then((res) => response.status(200).json({ status: "success" }))
            .catch((err) => response.status(500).json({ status: "failed" }));
    }
};

exports.addPicture = (request, response) => {
    if (!request?.body) {
        response.status(400).json({ status: "failed", reason: "missing payload for picture adding" });
        return;
    }

    if (!request?.body?.product_id || isNaN(request?.body?.product_id) || request?.body?.product_id < 0) {
        response.status(404).json({ status: "failed", reason: "product_id is invalid" });
        return;
    }

    if (!request?.body?.picture_path || request?.body?.picture_path === "") {
        response.status(404).json({ status: "failed", reason: "picture_path is invalid" });
        return;
    }

    pool.query('INSERT INTO "AutoDetailing"."EntityPicture" (product_id, picture_path) VALUES ($1, $2)', [request.body.product_id, request.body.picture_path])
        .then((res) => response.status(200).json({ status: "success" }))
        .catch((err) => response.status(500).json({ status: "failed", reason: err.detail }));
};

exports.removePicture = (request, response) => {
    if (!request?.body) {
        response.status(400).json({ status: "failed", reason: "missing payload for picture adding" });
        return;
    }

    if (!request?.body?.product_id || isNaN(request?.body?.product_id) || request?.body?.product_id < 0) {
        response.status(404).json({ status: "failed", reason: "product_id is invalid" });
        return;
    }

    if (!request?.body?.picture_path || request?.body?.picture_path === "") {
        response.status(404).json({ status: "failed", reason: "picture_path is invalid" });
        return;
    }

    pool.query('DELETE FROM "AutoDetailing"."EntityPicture" WHERE product_id = $1 AND picture_path = $2', [request.body.product_id, request.body.picture_path])
        .then((res) => response.status(200).json({ status: "success" }))
        .catch((err) => response.status(500).json({ status: "failed", reason: err.detail }));
};

exports.getProductPictures = (request, response) => {
    if (!request?.params?.id || isNaN(request?.params?.id) || request?.params?.id < 0) {
        response.status(404).json({ status: "failed", reason: "picture_id is invalid" });
        return;
    }

    pool.query('SELECT picture_path FROM "AutoDetailing"."EntityPicture" WHERE product_id = $1',
        [request.params.id])
        .then((res) => response.status(200).json({ status: "success", payload: res.rows }))
        .catch((err) => response.status(500).json({ status: "failed", reason: err }));
};