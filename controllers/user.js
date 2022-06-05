const pool = require("../database.js");
const StringUtils = require("../utils/string.js");

exports.getAllUsers = (request, response) => {
    pool.query('SELECT * FROM "AutoDetailing"."Users"')
        .then((res) => response.status(200).json({ status: "success", payload: res.rows }))
        .catch((err) => response.status(500).json({ status: "failed", reason: err }));
};

exports.getUsersByRoleName = (request, response) => {
    pool.query('SELECT * FROM "AutoDetailing"."Users" WHERE role_name = $1', [[StringUtils.capitalizeFirstChar(request.params.name)]])
        .then((res) => response.status(200).json({ status: "success", payload: res.rows }))
        .catch((err) => response.status(500).json({ status: "failed", reason: err }));
};

exports.getUserById = (request, response) => {
    if (!request?.params?.id || isNaN(request?.params?.id) || request?.params?.id < 0) {
        response.status(404).json({ status: "failed", reason: "user_id is invalid" });
        return;
    }

    pool.query('SELECT * FROM "AutoDetailing"."Users" WHERE user_id = $1', [request.params.id])
        .then((res) => response.status(200).json({ status: "success", payload: res.rows }))
        .catch((err) => response.status(500).json({ status: "failed", reason: err }));
};

exports.getUserByUsername = (request, response) => {
    pool.query('SELECT * FROM "AutoDetailing"."Users" WHERE user_username = $1',
        [request.params.username])
        .then((res) => response.status(200).json({ status: "success", payload: res.rows }))
        .catch((err) => response.status(500).json({ status: "failed", reason: err }));
};

exports.getUserByFullname = (request, response) => {
    pool.query('SELECT * FROM "AutoDetailing"."Users" WHERE user_fullname = $1',
        [request.params.fullname])
        .then((res) => response.status(200).json({ status: "success", payload: res.rows }))
        .catch((err) => response.status(500).json({ status: "failed", reason: err }));
};

exports.getUserByPhone = (request, response) => {
    pool.query('SELECT * FROM "AutoDetailing"."Users" WHERE user_phone = $1',
        [request.params.phone])
        .then((res) => response.status(200).json({ status: "success", payload: res.rows }))
        .catch((err) => response.status(500).json({ status: "failed", reason: err }));
};

exports.getUserRoles = (request, response) => {
    if (!request?.params?.id || isNaN(request?.params?.id) || request?.params?.id < 0) {
        response.status(404).json({ status: "failed", reason: "user_id is invalid" });
        return;
    }

    pool.query('SELECT role_name FROM "AutoDetailing"."UserRole" JOIN "AutoDetailing"."Role" ON "AutoDetailing"."UserRole".role_id = "AutoDetailing"."Role".role_id WHERE user_id = $1',
        [request.params.id])
        .then((res) => response.status(200).json({ status: "success", payload: res.rows }))
        .catch((err) => response.status(500).json({ status: "failed", reason: err }));
};

exports.createUser = (request, response) => {
    if (!request?.body) {
        response.status(400).json({ status: "failed", reason: "missing user creation parameters" });
        return;
    }

    if (!request?.body?.username) {
        response.status(400).json({ status: "failed", reason: "user_username is invalid" });
        return;
    }

    if (!request?.body?.password) {
        response.status(400).json({ status: "failed", reason: "user_password is invalid" });
        return;
    }

    if (!request?.body?.email) {
        response.status(400).json({ status: "failed", reason: "user_email is invalid" });
        return;
    }

    if (!request?.body?.fullname) {
        response.status(400).json({ status: "failed", reason: "user_fullname is invalid" });
        return;
    }

    if (!request?.body?.role) {
        response.status(400).json({ status: "failed", reason: "role is invalid" });
        return;
    }

    let address = request.body.address ? request.body.address : "";
    let phone = request.body.phone ? request.body.phone : "";

    pool.query('INSERT INTO "AutoDetailing"."Users" (user_username, user_password, user_email, user_fullname, user_phone, user_address) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
        [request.body.username, request.body.password,
        request.body.email, request.body.fullname,
            address, phone])
        .then((res) => response.status(200).json({ status: "success", "user": res.rows[0] }))
        .catch((err) => response.status(500).json({ status: "failed", reason: err }));
};

exports.updateUser = (request, response) => {
    if (!request?.params?.id || isNaN(request?.params?.id) || request?.params?.id < 0) {
        response.status(400).json({ status: "failed", reason: "user_id is invalid" });
        return;
    }

    let setQueryString = "";

    // expects an object with a key matching the db column LITERALLY
    if (request?.body?.updateData && Object.keys(request.body.updateData).length !== 0) {
        for (const [key, value] of Object.entries(request.body.updateData))
            setQueryString = setQueryString.concat(", " + `${key} = '${value}'`);


        if (setQueryString.startsWith(",")) setQueryString = setQueryString.replace(",", "");

        pool.query(`UPDATE "AutoDetailing"."Users" set ${setQueryString} WHERE user_id = $1`, [request.params.id])
            .then((res) => response.status(200).json({ status: "success" }))
            .catch((err) => response.status(500).json({ status: "failed" }));
    }
};

exports.deleteUser = (request, response) => {
    if (!request?.params?.id || isNaN(request?.params?.id) || request?.params?.id < 0) {
        response.status(400).json({ status: "failed", reason: "user_id is invalid" });
        return;
    }

    pool.query('DELETE FROM "AutoDetailing"."Users" WHERE user_id = $1', [request.params.id])
        .then((res) => response.status(200).json({ status: "success" }))
        .catch((err) => response.status(500).json({ status: "failed" }));
};

exports.addRole = (request, response) => {
    if (!request?.body) {
        response.status(400).json({ status: "failed", reason: "missing payload for role assigning" });
        return;
    }

    if (!request?.body?.user_id || isNaN(request?.body?.user_id) || request?.body?.user_id < 0) {
        response.status(404).json({ status: "failed", reason: "user_id is invalid" });
        return;
    }

    if (!request?.body?.role_id || isNaN(request?.body?.role_id) || request?.body?.role_id < 0) {
        response.status(404).json({ status: "failed", reason: "role_id is invalid" });
        return;
    }

    pool.query('INSERT INTO "AutoDetailing"."UserRole" (user_id, role_id) VALUES ($1, $2)', [request.body.user_id, request.body.role_id])
        .then((res) => response.status(200).json({ status: "success" }))
        .catch((err) => response.status(500).json({ status: "failed", reason: err.detail }));
};

exports.removeRole = (request, response) => {
    if (!request?.body) {
        response.status(400).json({ status: "failed", reason: "missing payload for role assigning" });
        return;
    }

    if (!request?.body?.user_id || isNaN(request?.body?.user_id) || request?.body?.user_id < 0) {
        response.status(404).json({ status: "failed", reason: "user_id is invalid" });
        return;
    }

    if (!request?.body?.role_id || isNaN(request?.body?.role_id) || request?.body?.role_id < 0) {
        response.status(404).json({ status: "failed", reason: "role_id is invalid" });
        return;
    }

    pool.query('DELETE FROM "AutoDetailing"."UserRole" WHERE user_id = $1 AND role_id = $2', [request.body.user_id, request.body.role_id])
        .then((res) => response.status(200).json({ status: "success" }))
        .catch((err) => response.status(500).json({ status: "failed", reason: err.detail }));
};

