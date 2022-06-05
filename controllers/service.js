const pool = require("../database.js");
const StringUtils = require("../utils/string.js");

exports.getAllServices = (request, response) => {
    pool.query('SELECT * FROM "AutoDetailing"."Service"')
        .then((res) => response.status(200).json({ status: "success", payload: res.rows }))
        .catch((err) => response.status(500).json({ status: "failed", reason: err }));
};

exports.getServiceById = (request, response) => {
    if (!request?.params?.id || isNaN(request?.params?.id) || request?.params?.id < 0) {
        response.status(404).json({ status: "failed", reason: "service_id is invalid" });
        return;
    }

    pool.query('SELECT * FROM "AutoDetailing"."Service" WHERE service_id = $1', [request.params.id])
        .then((res) => response.status(200).json({ status: "success", payload: res.rows }))
        .catch((err) => response.status(500).json({ status: "failed", reason: err }));
};

exports.getServiceByTitle = (request, response) => {
    pool.query('SELECT * FROM "AutoDetailing"."Service" WHERE service_title = $1',
        [request.params.title])
        .then((res) => response.status(200).json({ status: "success", payload: res.rows }))
        .catch((err) => response.status(500).json({ status: "failed", reason: err }));
};

exports.getServicePictures = (request, response) => {
    if (!request?.params?.id || isNaN(request?.params?.id) || request?.params?.id < 0) {
        response.status(404).json({ status: "failed", reason: "service_id is invalid" });
        return;
    }

    pool.query('SELECT picture_path FROM "AutoDetailing"."EntityPicture" WHERE service_id = $1',
        [request.params.id])
        .then((res) => response.status(200).json({ status: "success", payload: res.rows }))
        .catch((err) => response.status(500).json({ status: "failed", reason: err }));
};

exports.getServiceVehicleTypes = (request, response) => {
    if (!request?.params?.id || isNaN(request?.params?.id) || request?.params?.id < 0) {
        response.status(404).json({ status: "failed", reason: "service_id is invalid" });
        return;
    }

    pool.query('SELECT vt_type FROM "AutoDetailing"."ServiceVehicleType" JOIN "AutoDetailing"."VehicleType" ON "AutoDetailing"."ServiceVehicleType".vt_id = "AutoDetailing"."VehicleType".vt_id WHERE service_id = $1',
        [request.params.id])
        .then((res) => response.status(200).json({ status: "success", payload: res.rows }))
        .catch((err) => response.status(500).json({ status: "failed", reason: err }));
};

exports.createService = (request, response) => {
    if (!request?.body) {
        response.status(400).json({ status: "failed", reason: "missing service creation parameters" });
        return;
    }

    if (!request?.body?.description) {
        response.status(400).json({ status: "failed", reason: "service_description is invalid" });
        return;
    }

    if (!request?.body?.title) {
        response.status(400).json({ status: "failed", reason: "service_title is invalid" });
        return;
    }

    if (!request?.body?.price) {
        response.status(400).json({ status: "failed", reason: "service_price is invalid" });
        return;
    }

    pool.query('INSERT INTO "AutoDetailing"."Service" (service_title, service_description, service_price) VALUES ($1, $2, $3) RETURNING *',
        [request.body.title, request.body.description, request.body.price])
        .then((res) => response.status(200).json({ status: "success", "user": res.rows[0] }))
        .catch((err) => response.status(500).json({ status: "failed", reason: err }));

};

exports.deleteService = (request, response) => {
    if (!request?.params?.id || isNaN(request?.params?.id) || request?.params?.id < 0) {
        response.status(400).json({ status: "failed", reason: "service_id is invalid" });
        return;
    }

    pool.query('DELETE FROM "AutoDetailing"."Service" WHERE service_id = $1', [request.params.id])
        .then((res) => response.status(200).json({ status: "success" }))
        .catch((err) => response.status(500).json({ status: "failed" }));
};

exports.updateService = (request, response) => {
    if (!request?.params?.id || isNaN(request?.params?.id) || request?.params?.id < 0) {
        response.status(400).json({ status: "failed", reason: "service_id is invalid" });
        return;
    }

    let setQueryString = "";

    // expects an object with a key matching the db column LITERALLY
    if (request?.body?.updateData && Object.keys(request.body.updateData).length !== 0) {
        for (const [key, value] of Object.entries(request.body.updateData))
            setQueryString = setQueryString.concat(", " + `${key} = '${value}'`);


        if (setQueryString.startsWith(",")) setQueryString = setQueryString.replace(",", "");

        pool.query(`UPDATE "AutoDetailing"."Service" set ${setQueryString} WHERE service_id = $1`, [request.params.id])
            .then((res) => response.status(200).json({ status: "success" }))
            .catch((err) => response.status(500).json({ status: "failed" }));
    }
};

exports.addPicture = (request, response) => {
    if (!request?.body) {
        response.status(400).json({ status: "failed", reason: "missing payload for picture adding" });
        return;
    }

    if (!request?.body?.service_id || isNaN(request?.body?.service_id) || request?.body?.service_id < 0) {
        response.status(404).json({ status: "failed", reason: "service_id is invalid" });
        return;
    }

    if (!request?.body?.picture_path || request?.body?.picture_path === "") {
        response.status(404).json({ status: "failed", reason: "picture_path is invalid" });
        return;
    }

    pool.query('INSERT INTO "AutoDetailing"."EntityPicture" (service_id, picture_path) VALUES ($1, $2)', [request.body.service_id, request.body.picture_path])
        .then((res) => response.status(200).json({ status: "success" }))
        .catch((err) => response.status(500).json({ status: "failed", reason: err.detail }));
};

exports.removePicture = (request, response) => {
    if (!request?.body) {
        response.status(400).json({ status: "failed", reason: "missing payload for picture adding" });
        return;
    }

    if (!request?.body?.service_id || isNaN(request?.body?.service_id) || request?.body?.service_id < 0) {
        response.status(404).json({ status: "failed", reason: "service_id is invalid" });
        return;
    }

    if (!request?.body?.picture_path || request?.body?.picture_path === "") {
        response.status(404).json({ status: "failed", reason: "picture_path is invalid" });
        return;
    }

    pool.query('DELETE FROM "AutoDetailing"."EntityPicture" WHERE service_id = $1 AND picture_path = $2', [request.body.service_id, request.body.picture_path])
        .then((res) => response.status(200).json({ status: "success" }))
        .catch((err) => response.status(500).json({ status: "failed", reason: err.detail }));
};

exports.addVehicleType = (request, response) => {
    if (!request?.body) {
        response.status(400).json({ status: "failed", reason: "missing payload for vehicle type adding" });
        return;
    }

    if (!request?.body?.service_id || isNaN(request?.body?.service_id) || request?.body?.service_id < 0) {
        response.status(404).json({ status: "failed", reason: "service_id is invalid" });
        return;
    }

    if (!request?.body?.vt_id || isNaN(request?.body?.vt_id) || request?.body?.vt_id < 0) {
        response.status(404).json({ status: "failed", reason: "vt_id is invalid" });
        return;
    }

    pool.query('INSERT INTO "AutoDetailing"."ServiceVehicleType" (service_id, vt_id) VALUES ($1, $2)', [request.body.service_id, request.body.vt_id])
        .then((res) => response.status(200).json({ status: "success" }))
        .catch((err) => response.status(500).json({ status: "failed", reason: err.detail }));
};

exports.removeVehicleType = (request, response) => {
    if (!request?.body) {
        response.status(400).json({ status: "failed", reason: "missing payload for picture adding" });
        return;
    }

    if (!request?.body?.service_id || isNaN(request?.body?.service_id) || request?.body?.service_id < 0) {
        response.status(404).json({ status: "failed", reason: "service_id is invalid" });
        return;
    }

    if (!request?.body?.vt_id || isNaN(request?.body?.vt_id) || request?.body?.vt_id < 0) {
        response.status(404).json({ status: "failed", reason: "vt_id is invalid" });
        return;
    }

    pool.query('DELETE FROM "AutoDetailing"."ServiceVehicleType" WHERE service_id = $1 AND vt_id = $2', [request.body.service_id, request.body.vt_id])
        .then((res) => response.status(200).json({ status: "success" }))
        .catch((err) => response.status(500).json({ status: "failed", reason: err.detail }));
};