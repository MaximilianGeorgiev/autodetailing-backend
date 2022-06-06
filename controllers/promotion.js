const pool = require("../database.js");

exports.getAllPromotions = (request, response) => {
    pool.query('SELECT * FROM "AutoDetailing"."Promotion"')
        .then((res) => response.status(200).json({ status: "success", payload: res.rows }))
        .catch((err) => response.status(500).json({ status: "failed", reason: err }));
};

exports.getPromotionById = (request, response) => {
    if (!request?.params?.id || isNaN(request?.params?.id) || request?.params?.id < 0) {
        response.status(404).json({ status: "failed", reason: "promotion_id is invalid" });
        return;
    }

    pool.query('SELECT * FROM "AutoDetailing"."Promotion" WHERE promotion_id = $1', [request.params.id])
        .then((res) => response.status(200).json({ status: "success", payload: res.rows }))
        .catch((err) => response.status(500).json({ status: "failed", reason: err }));
};

exports.getPromotionsForServices = (request, response) => {
    pool.query('SELECT * FROM "AutoDetailing"."Promotion" WHERE service_id IS NOT NULL OR service_id != ""')
        .then((res) => response.status(200).json({ status: "success", payload: res.rows }))
        .catch((err) => response.status(500).json({ status: "failed", reason: err }));
};

exports.getPromotionByServiceId = (request, response) => {
    if (!request?.params?.id || isNaN(request?.params?.id) || request?.params?.id < 0) {
        response.status(404).json({ status: "failed", reason: "service_id is invalid" });
        return;
    }

    pool.query('SELECT * FROM "AutoDetailing"."Promotion" WHERE service_id = $1', [request.params.id])
        .then((res) => response.status(200).json({ status: "success", payload: res.rows }))
        .catch((err) => response.status(500).json({ status: "failed", reason: err }));
};

exports.getPromotionsForProducts = (request, response) => {
    pool.query('SELECT * FROM "AutoDetailing"."Promotion" WHERE product_id IS NOT NULL OR product_id != ""')
        .then((res) => response.status(200).json({ status: "success", payload: res.rows }))
        .catch((err) => response.status(500).json({ status: "failed", reason: err }));
};

exports.getPromotionByProductId = (request, response) => {
    if (!request?.params?.id || isNaN(request?.params?.id) || request?.params?.id < 0) {
        response.status(404).json({ status: "failed", reason: "product_id is invalid" });
        return;
    }

    pool.query('SELECT * FROM "AutoDetailing"."Promotion" WHERE product_id = $1', [request.params.id])
        .then((res) => response.status(200).json({ status: "success", payload: res.rows }))
        .catch((err) => response.status(500).json({ status: "failed", reason: err }));
};

exports.createPromotion = (request, response) => {
    if (!request?.body) {
        response.status(400).json({ status: "failed", reason: "missing product creation parameters" });
        return;
    }

    if (!request?.body?.price) {
        response.status(400).json({ status: "failed", reason: "promotion_new_price is invalid" });
        return;
    }

    if (!request?.body?.from) {
        response.status(400).json({ status: "failed", reason: "promotion_from is invalid" });
        return;
    }

    if (!request?.body?.to) {
        response.status(400).json({ status: "failed", reason: "promotion_to is invalid" });
        return;
    }

    if (!request?.body?.product_id && !request?.body?.service_id) {
        response.status(400).json({ status: "failed", reason: "no entity id provided" });
        return;
    }

    let fromDate = new Date(request.body.from).toISOString();
    let toDate = new Date(request.body.to).toISOString();


    let product_id = request.body.product_id !== null ? request.body.product_id : "";
    let service_id = request.body.service_id !== null ? request.body.service_id : "";


    console.log(request.body.product_id);
    pool.query('INSERT INTO "AutoDetailing"."Promotion" (promotion_from, promotion_to, promotion_new_price, product_id, service_id) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [fromDate, toDate, request.body.price, product_id, service_id])
        .then((res) => response.status(200).json({ status: "success", "promotion": res.rows[0] }))
        .catch((err) => response.status(500).json({ status: "failed", reason: err }));
};

exports.deletePromotion = (request, response) => {
    if (!request?.params?.id || isNaN(request?.params?.id) || request?.params?.id < 0) {
        response.status(400).json({ status: "failed", reason: "promotion_id is invalid" });
        return;
    }

    pool.query('DELETE FROM "AutoDetailing"."Promotion" WHERE promotion_id = $1', [request.params.id])
        .then((res) => response.status(200).json({ status: "success" }))
        .catch((err) => response.status(500).json({ status: "failed" }));
};

exports.updatePromotion = (request, response) => {
    if (!request?.params?.id || isNaN(request?.params?.id) || request?.params?.id < 0) {
        response.status(400).json({ status: "failed", reason: "promotion_id is invalid" });
        return;
    }

    let fromDate, toDate;

    if (request?.body?.updateData?.promotion_from) fromDate = new Date(request.body.updateData.promotion_from).toISOString();

    if (request?.body?.updateData?.promotion_to) toDate = new Date(request.body.updateData.promotion_to).toISOString();

    let setQueryString = "";

    // expects an object with a key matching the db column LITERALLY
    if (request?.body?.updateData && Object.keys(request.body.updateData).length !== 0) {
        for (const [key, value] of Object.entries(request.body.updateData)) {
            if (key === "promotion_from") setQueryString = setQueryString.concat(", " + `${key} = '${fromDate}'`);
            else if (key === "promotion_to") setQueryString = setQueryString.concat(", " + `${key} = '${toDate}'`);
            else setQueryString = setQueryString.concat(", " + `${key} = '${value}'`);
        }


        if (setQueryString.startsWith(",")) setQueryString = setQueryString.replace(",", "");

        pool.query(`UPDATE "AutoDetailing"."Promotion" set ${setQueryString} WHERE promotion_id = $1`, [request.params.id])
            .then((res) => response.status(200).json({ status: "success" }))
            .catch((err) => response.status(500).json({ status: "failed" }));
    }
};