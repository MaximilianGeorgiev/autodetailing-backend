const pool = require("../database.js");
const StringUtils = require("../utils/string.js");

exports.getAllVehicleTypes = (request, response) => {
    pool.query('SELECT * FROM "AutoDetailing"."VehicleType"')
    .then((res) => response.status(200).json({ status: "success", payload: res.rows }))
    .catch((err) => response.status(500).json({ status: "failed", reason: err }));
};

exports.getVehicleTypeById = (request, response) => {
    if (isNaN(request?.params?.id)) {
        response.status(404).json({ status: "failed", reason: "vehicletype_id is invalid" });
        return;
    }

    pool.query('SELECT * FROM "AutoDetailing"."VehicleType" WHERE vehicletype_id = $1', [request.params.id])
        .then((res) => response.status(200).json({ status: "success", payload: res.rows }))
        .catch((err) => response.status(500).json({ status: "failed", reason: err }));
};

exports.getVehicleTypeByType = (request, response) => {
// it is likely that the query comes with a lower case and that would lead to a false query and no results will be
    // found. The roles in the database start with an upper case and need to be transformed.
    pool.query('SELECT * FROM "AutoDetailing"."VehicleType" WHERE vehicletype_type = $1',
        [StringUtils.capitalizeFirstChar(request.params.type)])
        .then((res) => response.status(200).json({ status: "success", payload: res.rows }))
        .catch((err) => response.status(500).json({ status: "failed", reason: err }));
};

exports.createVehicleType = (request, response) => {
    if (!request?.body || !request?.body?.name || request?.body?.name === "") {
        response.status(400).json({ status: "failed", reason: "vehicletype_type is invalid" });
        return;
    }

    pool.query('INSERT INTO "AutoDetailing"."VehicleType" (vehicletype_type) VALUES ($1)', [request.body.type])
        .then((res) => response.status(200).json({ status: "success" }))
        .catch((err) => response.status(500).json({ status: "failed", reason: err }));
};

exports.deleteVehicleType = (request, response) => {
    if (!request?.params?.id || isNaN(request?.params?.id) || request?.params?.id < 0) {
        response.status(400).json({ status: "failed", reason: "vehicletype_id is invalid" });
        return;
    }

    pool.query('DELETE FROM "AutoDetailing"."VehicleType" WHERE vehicletype_id = $1', [request.params.id])
        .then((res) => response.status(200).json({ status: "success" }))
        .catch((err) => response.status(500).json({ status: "failed" }));
};

exports.updateVehicleType = (request, response) => {
    if (!request?.params?.id || isNaN(request?.params?.id) || request?.params?.id < 0) {
        response.status(400).json({ status: "failed", reason: "vehicletype_id is invalid" });
        return;
    }

    if (!request?.body || !request?.body?.name || request?.body?.name === "") {
        response.status(400).json({ status: "failed", reason: "vehicletype_type is invalid" });
        return;
    }

    pool.query('UPDATE "AutoDetailing"."VehicleType" set vehicletype_type = $1 WHERE vehicletype_id = $2', [request.body.name, request.params.id])
        .then((res) => response.status(200).json({ status: "success" }))
        .catch((err) => response.status(500).json({ status: "failed" }));
};

module.exports = router;