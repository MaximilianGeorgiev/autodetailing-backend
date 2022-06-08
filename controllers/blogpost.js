const pool = require("../database.js");

exports.getAllBlogs = (request, response) => {
    pool.query('SELECT * FROM "AutoDetailing"."BlogPost"')
        .then((res) => response.status(200).json({ status: "success", payload: res.rows }))
        .catch((err) => response.status(500).json({ status: "failed", reason: err }));
};

exports.getBlogById = (request, response) => {
    if (!request?.params?.id || isNaN(request?.params?.id) || request?.params?.id < 0) {
        response.status(404).json({ status: "failed", reason: "blog_id is invalid" });
        return;
    }

    pool.query('SELECT * FROM "AutoDetailing"."BlogPost" WHERE blog_id = $1', [request.params.id])
        .then((res) => response.status(200).json({ status: "success", payload: res.rows }))
        .catch((err) => response.status(500).json({ status: "failed", reason: err }));
};

exports.getBlogByTitle = (request, response) => {
    pool.query('SELECT * FROM "AutoDetailing"."BlogPost" WHERE blog_title = $1',
        [request.params.title])
        .then((res) => response.status(200).json({ status: "success", payload: res.rows }))
        .catch((err) => response.status(500).json({ status: "failed", reason: err }));
};

exports.getBlogByAuthorId = (request, response) => {
    pool.query('SELECT * FROM "AutoDetailing"."BlogPost" WHERE author_id = $1',
        [request.params.author_id])
        .then((res) => response.status(200).json({ status: "success", payload: res.rows }))
        .catch((err) => response.status(500).json({ status: "failed", reason: err }));
};

exports.getBlogPictures = (request, response) => {
    if (!request?.params?.id || isNaN(request?.params?.id) || request?.params?.id < 0) {
        response.status(404).json({ status: "failed", reason: "blog_id is invalid" });
        return;
    }

    pool.query('SELECT picture_path FROM "AutoDetailing"."EntityPicture" WHERE blog_id = $1',
        [request.params.id])
        .then((res) => response.status(200).json({ status: "success", payload: res.rows }))
        .catch((err) => response.status(500).json({ status: "failed", reason: err }));
};

exports.deleteBlog = (request, response) => {
    if (!request?.params?.id || isNaN(request?.params?.id) || request?.params?.id < 0) {
        response.status(400).json({ status: "failed", reason: "blog_id is invalid" });
        return;
    }

    pool.query('DELETE FROM "AutoDetailing"."BlogPost" WHERE blog_id = $1', [request.params.id])
        .then((res) => response.status(200).json({ status: "success" }))
        .catch((err) => response.status(500).json({ status: "failed" }));
};

exports.createBlog = (request, response) => {
    if (!request?.body) {
        response.status(400).json({ status: "failed", reason: "missing blog creation parameters" });
        return;
    }

    if (!request?.body?.text) {
        response.status(400).json({ status: "failed", reason: "blog_text is invalid" });
        return;
    }

    if (!request?.body?.title) {
        response.status(400).json({ status: "failed", reason: "blog_title is invalid" });
        return;
    }

    if (!request?.body?.author_id) {
        response.status(400).json({ status: "failed", reason: "author_id is invalid" });
        return;
    }

    pool.query('INSERT INTO "AutoDetailing"."BlogPost" (blog_title, blog_text, author_id) VALUES ($1, $2, $3) RETURNING *',
        [request.body.title, request.body.text, request.body.author_id])
        .then((res) => response.status(200).json({ status: "success", "blog": res.rows[0] }))
        .catch((err) => response.status(500).json({ status: "failed", reason: err.detail }));

};

exports.updateBlog = (request, response) => {
    if (!request?.params?.id || isNaN(request?.params?.id) || request?.params?.id < 0) {
        response.status(400).json({ status: "failed", reason: "blog_id is invalid" });
        return;
    }

    let setQueryString = "";

    // expects an object with a key matching the db column LITERALLY
    if (request?.body?.updateData && Object.keys(request.body.updateData).length !== 0) {
        for (const [key, value] of Object.entries(request.body.updateData))
            setQueryString = setQueryString.concat(", " + `${key} = '${value}'`);


        if (setQueryString.startsWith(",")) setQueryString = setQueryString.replace(",", "");

        pool.query(`UPDATE "AutoDetailing"."BlogPost" set ${setQueryString} WHERE blog_id = $1`, [request.params.id])
            .then((res) => response.status(200).json({ status: "success" }))
            .catch((err) => response.status(500).json({ status: "failed" }));
    }
};

exports.addPicture = (request, response) => {
    if (!request?.body) {
        response.status(400).json({ status: "failed", reason: "missing payload for picture adding" });
        return;
    }

    if (!request?.body?.blog_id || isNaN(request?.body?.blog_id) || request?.body?.blog_id < 0) {
        response.status(404).json({ status: "failed", reason: "blog_id is invalid" });
        return;
    }

    if (!request?.body?.picture_path || request?.body?.picture_path === "") {
        response.status(404).json({ status: "failed", reason: "picture_path is invalid" });
        return;
    }

    pool.query('INSERT INTO "AutoDetailing"."EntityPicture" (blog_id, picture_path) VALUES ($1, $2)', [request.body.blog_id, request.body.picture_path])
        .then((res) => response.status(200).json({ status: "success" }))
        .catch((err) => response.status(500).json({ status: "failed", reason: err.detail }));
};

exports.removePicture = (request, response) => {
    if (!request?.body) {
        response.status(400).json({ status: "failed", reason: "missing payload for picture adding" });
        return;
    }

    if (!request?.body?.blog_id || isNaN(request?.body?.blog_id) || request?.body?.blog_id < 0) {
        response.status(404).json({ status: "failed", reason: "blog_id is invalid" });
        return;
    }

    if (!request?.body?.picture_path || request?.body?.picture_path === "") {
        response.status(404).json({ status: "failed", reason: "picture_path is invalid" });
        return;
    }

    pool.query('DELETE FROM "AutoDetailing"."EntityPicture" WHERE blog_id = $1 AND picture_path = $2', [request.body.blog_id, request.body.picture_path])
        .then((res) => response.status(200).json({ status: "success" }))
        .catch((err) => response.status(500).json({ status: "failed", reason: err.detail }));
};