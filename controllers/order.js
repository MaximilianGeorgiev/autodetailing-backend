const pool = require("../database.js");

exports.getAllOrders = (request, response) => {
    pool.query('SELECT * FROM "AutoDetailing"."Order"')
        .then((res) => response.status(200).json({ status: "success", payload: res.rows }))
        .catch((err) => response.status(500).json({ status: "failed", reason: err }));
};

exports.getOrderById = (request, response) => {
    if (!request?.params?.id || isNaN(request?.params?.id) || request?.params?.id < 0) {
        response.status(404).json({ status: "failed", reason: "order_id is invalid" });
        return;
    }

    pool.query('SELECT * FROM "AutoDetailing"."Order" WHERE order_id = $1', [request.params.id])
        .then((res) => response.status(200).json({ status: "success", payload: res.rows }))
        .catch((err) => response.status(500).json({ status: "failed", reason: err }));
};

exports.getOrdersForCustomer = (request, response) => {
    if (!request?.params?.id || isNaN(request?.params?.id) || request?.params?.id < 0) {
        response.status(404).json({ status: "failed", reason: "customer_id is invalid" });
        return;
    }

    pool.query('SELECT * FROM "AutoDetailing"."Order" WHERE customer_id = $1', [request.params.id])
        .then((res) => response.status(200).json({ status: "success", payload: res.rows }))
        .catch((err) => response.status(500).json({ status: "failed", reason: err }));
};

exports.getOrderProducts = (request, response) => {
    if (!request?.params?.id || isNaN(request?.params?.id) || request?.params?.id < 0) {
        response.status(404).json({ status: "failed", reason: "order_id is invalid" });
        return;
    }

    pool.query('SELECT * FROM "AutoDetailing"."OrderProduct" WHERE order_id = $1', [request.params.id])
        .then((res) => response.status(200).json({ status: "success", payload: res.rows }))
        .catch((err) => response.status(500).json({ status: "failed", reason: err }));
};

exports.getOrdersForProduct = (request, response) => {
    if (!request?.params?.id || isNaN(request?.params?.id) || request?.params?.id < 0) {
        response.status(404).json({ status: "failed", reason: "product_id is invalid" });
        return;
    }

    pool.query('SELECT * FROM "AutoDetailing"."OrderProduct" WHERE product_id = $1', [request.params.id])
        .then((res) => response.status(200).json({ status: "success", payload: res.rows }))
        .catch((err) => response.status(500).json({ status: "failed", reason: err }));
};

exports.updateOrder = (request, response) => {
    if (!request?.params?.id || isNaN(request?.params?.id) || request?.params?.id < 0) {
        response.status(400).json({ status: "failed", reason: "order_id is invalid" });
        return;
    }

    let setQueryString = "";

    // expects an object with a key matching the db column LITERALLY
    if (request?.body?.updateData && Object.keys(request.body.updateData).length !== 0) {
        for (const [key, value] of Object.entries(request.body.updateData))
            setQueryString = setQueryString.concat(", " + `${key} = '${value}'`);

        if (setQueryString.startsWith(",")) setQueryString = setQueryString.replace(",", "");

        pool.query(`UPDATE "AutoDetailing"."Order" set ${setQueryString} WHERE order_id = $1`, [request.params.id])
            .then((res) => response.status(200).json({ status: "success" }))
            .catch((err) => response.status(500).json({ status: "failed" }));
    };
};

exports.createOrder = (request, response) => {
    if (!request?.body || request?.body?.isdelivery === undefined) {
        response.status(400).json({ status: "failed", reason: "order_isdelivery is invalid" });
        return;
    }

    if (!request?.body || request?.body?.ispaid === undefined) {
        response.status(400).json({ status: "failed", reason: "order_ispaid is invalid" });
        return;
    }

    if (!request?.body || !request?.body?.customer_id || request?.body?.customer_id === undefined) {
        response.status(400).json({ status: "failed", reason: "customer_id is invalid" });
        return;
    }

    if (request?.body?.isdelivery === "true") {
        if (!request?.body?.address || request?.body?.address === "") {
            response.status(400).json({ status: "failed", reason: "order_address is blank for delivery" });
            return;
        }
    }

    const totalPrice = request?.body?.totalprice ? request.body.totalprice : 0;
    const address = request?.body?.address ? request.body.address : "";

    pool.query('INSERT INTO "AutoDetailing"."Order" (order_totalprice, order_isdelivery, order_address, order_ispaid, customer_id) VALUES ($1, $2, $3, $4, $5)',
        [totalPrice, request.body.isdelivery, address, request.body.ispaid, request.body.customer_id])
        .then((res) => response.status(200).json({ status: "success" }))
        .catch((err) => response.status(500).json({ status: "failed", reason: err }));
};

exports.deleteOrder = (request, response) => {
    if (!request?.params?.id || isNaN(request?.params?.id) || request?.params?.id < 0) {
        response.status(400).json({ status: "failed", reason: "order_id is invalid" });
        return;
    }

    pool.query('DELETE FROM "AutoDetailing"."Order" WHERE order_id = $1', [request.params.id])
        .then((res) => response.status(200).json({ status: "success" }))
        .catch((err) => response.status(500).json({ status: "failed" }));
};

exports.addProduct = (request, response) => {
    if (!request?.body) {
        response.status(400).json({ status: "failed", reason: "missing payload for order adding" });
        return;
    }

    if (!request?.body?.order_id || isNaN(request?.body?.order_id) || request?.body?.order_id < 0) {
        response.status(404).json({ status: "failed", reason: "order_id is invalid" });
        return;
    }

    if (!request?.body?.product_id || isNaN(request?.body?.product_id) || request?.body?.product_id < 0) {
        response.status(404).json({ status: "failed", reason: "product_id is invalid" });
        return;
    }

    pool.query('INSERT INTO "AutoDetailing"."OrderProduct" (order_id, product_id) VALUES ($1, $2)', [request.body.order_id, request.body.product_id])
        .then((res) => response.status(200).json({ status: "success" }))
        .catch((err) => response.status(500).json({ status: "failed", reason: err.detail }));
};