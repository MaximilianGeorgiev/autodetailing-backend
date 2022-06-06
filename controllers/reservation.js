const pool = require("../database.js");

exports.getAllReservations = (request, response) => {
    pool.query('SELECT * FROM "AutoDetailing"."Reservation"')
        .then((res) => response.status(200).json({ status: "success", payload: res.rows }))
        .catch((err) => response.status(500).json({ status: "failed", reason: err }));
};

exports.getReservationById = (request, response) => {
    if (!request?.params?.id || isNaN(request?.params?.id) || request?.params?.id < 0) {
        response.status(404).json({ status: "failed", reason: "reservation_id is invalid" });
        return;
    }

    pool.query('SELECT * FROM "AutoDetailing"."Reservation" WHERE reservation_id = $1', [request.params.id])
        .then((res) => response.status(200).json({ status: "success", payload: res.rows }))
        .catch((err) => response.status(500).json({ status: "failed", reason: err }));
};

exports.getReservationsOnDate = (request, response) => {
    if (!request?.params?.date || isNaN(request?.params?.date) || request?.params?.date < 0) {
        response.status(404).json({ status: "failed", reason: "reservation_date is invalid" });
        return;
    }

    const date = new Date(request.body.date).toISOString();

    pool.query('SELECT * FROM "AutoDetailing"."Reservation" WHERE reservation_date = $1', [date])
        .then((res) => response.status(200).json({ status: "success", payload: res.rows }))
        .catch((err) => response.status(500).json({ status: "failed", reason: err }));
};

exports.getReservationsForCustomer = (request, response) => {
    if (!request?.params?.id || isNaN(request?.params?.id) || request?.params?.id < 0) {
        response.status(404).json({ status: "failed", reason: "user_id is invalid" });
        return;
    }

    pool.query('SELECT * FROM "AutoDetailing"."Reservation" WHERE user_id = $1', [request.params.id])
        .then((res) => response.status(200).json({ status: "success", payload: res.rows }))
        .catch((err) => response.status(500).json({ status: "failed", reason: err }));
};

exports.createReservation = (request, response) => {
    if (!request?.body) {
        response.status(400).json({ status: "failed", reason: "missing reservation creation parameters" });
        return;
    }

    if (!request?.body?.datetime) {
        response.status(400).json({ status: "failed", reason: "reservation_datetime is invalid" });
        return;
    }

    if (!request?.body?.ispaid) {
        response.status(400).json({ status: "failed", reason: "reservation_ispaid is invalid" });
        return;
    }

    if (!request?.body?.user_id) {
        response.status(400).json({ status: "failed", reason: "user_id is invalid" });
        return;
    }

    let dateTime = new Date(request.body.datetime).toISOString();
    let totalPrice = request?.body?.totalPrice ? request.body.totalPrice : null;

    pool.query('INSERT INTO "AutoDetailing"."Reservation" (reservation_datetime, reservation_totalprice, reservation_ispaid, user_id) VALUES ($1, $2, $3, $4) RETURNING *',
        [dateTime, totalPrice, request.body.ispaid, request.body.user_id])
        .then((res) => response.status(200).json({ status: "success", "reservation": res.rows[0] }))
        .catch((err) => response.status(500).json({ status: "failed", reason: err }));
};

exports.deleteReservation = (request, response) => {
    if (!request?.params?.id || isNaN(request?.params?.id) || request?.params?.id < 0) {
        response.status(400).json({ status: "failed", reason: "reservation_id is invalid" });
        return;
    }

    pool.query('DELETE FROM "AutoDetailing"."Reservation" WHERE reservation_id = $1', [request.params.id])
        .then((res) => response.status(200).json({ status: "success" }))
        .catch((err) => response.status(500).json({ status: "failed" }));
};

exports.updateReservation = (request, response) => {
    if (!request?.params?.id || isNaN(request?.params?.id) || request?.params?.id < 0) {
        response.status(400).json({ status: "failed", reason: "reservation_id is invalid" });
        return;
    }

    let date;

    if (request?.body?.updateData?.reservation_datetime) date = new Date(request.body.updateData.reservation_datetime).toISOString();
    let setQueryString = "";

    // expects an object with a key matching the db column LITERALLY
    if (request?.body?.updateData && Object.keys(request.body.updateData).length !== 0) {
        for (const [key, value] of Object.entries(request.body.updateData)) {
            if (key === "reservation_datetime") setQueryString = setQueryString.concat(", " + `${key} = '${date}'`);
            else setQueryString = setQueryString.concat(", " + `${key} = '${value}'`);
        }

        if (setQueryString.startsWith(",")) setQueryString = setQueryString.replace(",", "");

        pool.query(`UPDATE "AutoDetailing"."Reservation" set ${setQueryString} WHERE reservation_id = $1`, [request.params.id])
            .then((res) => response.status(200).json({ status: "success" }))
            .catch((err) => response.status(500).json({ status: "failed" }));
    }
};

exports.addService = (request, response) => {
    if (!request?.body) {
        response.status(400).json({ status: "failed", reason: "missing payload for service adding" });
        return;
    }

    if (!request?.body?.service_id || isNaN(request?.body?.service_id) || request?.body?.service_id < 0) {
        response.status(404).json({ status: "failed", reason: "service_id is invalid" });
        return;
    }

    if (!request?.body?.reservation_id || isNaN(request?.body?.reservation_id) || request?.body?.reservation_id < 0) {
        response.status(404).json({ status: "failed", reason: "reservation_id is invalid" });
        return;
    }

    pool.query('INSERT INTO "AutoDetailing"."ReservationService" (reservation_id, service_id) VALUES ($1, $2)', [request.body.reservation_id, request.body.service_id])
        .then((res) => response.status(200).json({ status: "success" }))
        .catch((err) => response.status(500).json({ status: "failed", reason: err.detail }));
};