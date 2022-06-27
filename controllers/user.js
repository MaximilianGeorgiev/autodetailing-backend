const pool = require("../database.js");
const StringUtils = require("../utils/string.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const AuthUtils = require("../utils/auth.js");

exports.userExists = (request, response) => {
  if (!request.params.username) {
    response
      .status(404)
      .json({ status: "failed", reason: "user_username is invalid" });
    return;
  }

  if (!request.params.email) {
    response
      .status(404)
      .json({ status: "failed", reason: "user_email is invalid" });
    return;
  }

  pool
    .query(
      'SELECT * FROM "AutoDetailing"."Users" WHERE user_username = $1 OR user_email = $2',
      [request.params.username, request.params.email]
    )
    .then((res) => {
      if (res.rows.length === 0)
        response
          .status(200)
          .json({ status: "success", result: "user not found" });
      else
        response.status(200).json({ status: "success", result: "user exists" });
    });
};

exports.getAllUsers = (request, response) => {
  pool
    .query('SELECT * FROM "AutoDetailing"."Users"')
    .then((res) => {
      let payload = [];

      // omit password in response
      for (let i = 0; i < res.rows.length; i++) {
        let row = {};
        for (const [key, value] of Object.entries(res.rows[i])) {
          if (key !== "user_password") row[key] = value;
        }

        payload.push(row);
      }

      response.status(200).json({ status: "success", payload: payload });
    })
    .catch((err) =>
      response.status(500).json({ status: "failed", reason: err })
    );
};

exports.getUsersByRoleName = (request, response) => {
  pool
    .query(
      'SELECT "AutoDetailing"."Users".* FROM "AutoDetailing"."UserRole" JOIN "AutoDetailing"."Role" ON "AutoDetailing"."UserRole".role_id = "AutoDetailing"."Role".role_id JOIN "AutoDetailing"."Users" ON "AutoDetailing"."UserRole".user_id = "AutoDetailing"."Users".user_id WHERE "AutoDetailing"."Role".role_name = $1',
      [StringUtils.capitalizeFirstChar(request.params.name)]
    )
    .then((res) => {
      let payload = [];

      // omit password in response
      for (let i = 0; i < res.rows.length; i++) {
        let row = {};
        for (const [key, value] of Object.entries(res.rows[i])) {
          if (key !== "user_password") row[key] = value;
        }

        payload.push(row);
      }

      response.status(200).json({ status: "success", payload: payload });
    })
    .catch((err) =>
      response.status(500).json({ status: "failed", reason: err })
    );
};

exports.getUserById = (request, response) => {
  if (
    !request?.params?.id ||
    isNaN(request?.params?.id) ||
    request?.params?.id < 0
  ) {
    response
      .status(404)
      .json({ status: "failed", reason: "user_id is invalid" });
    return;
  }

  pool
    .query('SELECT * FROM "AutoDetailing"."Users" WHERE user_id = $1', [
      request.params.id,
    ])
    .then((res) => {
      let payload = [];

      // omit password in response
      for (let i = 0; i < res.rows.length; i++) {
        let row = {};
        for (const [key, value] of Object.entries(res.rows[i])) {
          if (key !== "user_password") row[key] = value;
        }

        payload.push(row);
      }

      response.status(200).json({ status: "success", payload: payload });
    })
    .catch((err) =>
      response.status(500).json({ status: "failed", reason: err })
    );
};

exports.getUserByUsername = (request, response) => {
  pool
    .query('SELECT * FROM "AutoDetailing"."Users" WHERE user_username = $1', [
      request.params.username,
    ])
    .then((res) => {
      let payload = [];

      // omit password in response
      for (let i = 0; i < res.rows.length; i++) {
        let row = {};
        for (const [key, value] of Object.entries(res.rows[i])) {
          if (key !== "user_password") row[key] = value;
        }

        payload.push(row);
      }

      response.status(200).json({ status: "success", payload: payload });
    })
    .catch((err) =>
      response.status(500).json({ status: "failed", reason: err })
    );
};

exports.getUserByFullname = (request, response) => {
  pool
    .query('SELECT * FROM "AutoDetailing"."Users" WHERE user_fullname = $1', [
      request.params.fullname,
    ])
    .then((res) => {
      let payload = [];

      // omit password in response
      for (let i = 0; i < res.rows.length; i++) {
        let row = {};
        for (const [key, value] of Object.entries(res.rows[i])) {
          if (key !== "user_password") row[key] = value;
        }

        payload.push(row);
      }

      response.status(200).json({ status: "success", payload: payload });
    })
    .catch((err) =>
      response.status(500).json({ status: "failed", reason: err })
    );
};

exports.getUserByPhone = (request, response) => {
  pool
    .query('SELECT * FROM "AutoDetailing"."Users" WHERE user_phone = $1', [
      request.params.phone,
    ])
    .then((res) => {
      let payload = [];

      // omit password in response
      for (let i = 0; i < res.rows.length; i++) {
        let row = {};
        for (const [key, value] of Object.entries(res.rows[i])) {
          if (key !== "user_password") row[key] = value;
        }

        payload.push(row);
      }

      response.status(200).json({ status: "success", payload: payload });
    })
    .catch((err) =>
      response.status(500).json({ status: "failed", reason: err })
    );
};

exports.getUserRoles = (request, response) => {
  if (
    !request?.params?.id ||
    isNaN(request?.params?.id) ||
    request?.params?.id < 0
  ) {
    response
      .status(404)
      .json({ status: "failed", reason: "user_id is invalid" });
    return;
  }

  pool
    .query(
      'SELECT role_name FROM "AutoDetailing"."UserRole" JOIN "AutoDetailing"."Role" ON "AutoDetailing"."UserRole".role_id = "AutoDetailing"."Role".role_id WHERE user_id = $1',
      [request.params.id]
    )
    .then((res) =>
      response.status(200).json({ status: "success", payload: res.rows })
    )
    .catch((err) =>
      response.status(500).json({ status: "failed", reason: err })
    );
};

exports.createUser = async (request, response) => {
  if (!request?.body) {
    response
      .status(400)
      .json({ status: "failed", reason: "missing user creation parameters" });
    return;
  }

  if (!request?.body?.username) {
    response
      .status(400)
      .json({ status: "failed", reason: "user_username is invalid" });
    return;
  }

  if (!request?.body?.password) {
    response
      .status(400)
      .json({ status: "failed", reason: "user_password is invalid" });
    return;
  }

  if (!request?.body?.email) {
    response
      .status(400)
      .json({ status: "failed", reason: "user_email is invalid" });
    return;
  }

  if (!request?.body?.fullname) {
    response
      .status(400)
      .json({ status: "failed", reason: "user_fullname is invalid" });
    return;
  }

  let address = request.body.address ? request.body.address : "";
  let phone = request.body.phone ? request.body.phone : "";
  let hashedPassword = await bcrypt.hash(request.body.password, 10);
  let isGuest = request.body.isGuest ? request.body.isGuest : false;

  let userFound = false;

  pool
    .query(
      'INSERT INTO "AutoDetailing"."Users" (user_username, user_password, user_email, user_fullname, user_phone, user_address, is_guest) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [
        request.body.username,
        hashedPassword,
        request.body.email,
        request.body.fullname,
        phone,
        address,
        isGuest,
      ]
    )
    .then((res) => {
      let payload = [];

      // omit password in response
      for (let i = 0; i < res.rows.length; i++) {
        let row = {};
        for (const [key, value] of Object.entries(res.rows[i])) {
          if (key !== "user_password") row[key] = value;
        }

        payload.push(row);
      }
      response.status(200).json({ status: "success", user: payload });
    })
    .catch((err) =>
      response.status(500).json({ status: "failed", reason: err })
    );
};

exports.updateUser = async (request, response) => {
  if (
    !request?.params?.id ||
    isNaN(request?.params?.id) ||
    request?.params?.id < 0
  ) {
    response
      .status(400)
      .json({ status: "failed", reason: "user_id is invalid" });
    return;
  }

  let setQueryString = "";

  // expects an object with a key matching the db column LITERALLY
  if (
    request?.body?.updateData &&
    Object.keys(request.body.updateData).length !== 0
  ) {
    for (const [key, value] of Object.entries(request.body.updateData))
      setQueryString = setQueryString.concat(", " + `${key} = '${value}'`);

    if (setQueryString.startsWith(","))
      setQueryString = setQueryString.replace(",", "");

    await pool
      .query(
        `UPDATE "AutoDetailing"."Users" set ${setQueryString} WHERE user_id = $1`,
        [request.params.id]
      )
      .catch((err) => response.status(500).json({ status: "failed" }));

    // return the updated user to set cookies in web app
    let user = [];

    const result = await pool
      .query('SELECT * FROM "AutoDetailing"."Users" WHERE user_id = $1', [
        request.params.id,
      ])
      .then((res) => res.rows)
      .catch((err) => response.status(500).json({ status: "failed" }));

    // omit password in response
    for (let i = 0; i < result.length; i++) {
      let row = {};
      for (const [key, value] of Object.entries(result[i])) {
        if (key !== "user_password") row[key] = value;
      }

      user.push(row);
    }

    response.status(200).json({ status: "success", user: user });
  }
};

exports.deleteUser = (request, response) => {
  if (
    !request?.params?.id ||
    isNaN(request?.params?.id) ||
    request?.params?.id < 0
  ) {
    response
      .status(400)
      .json({ status: "failed", reason: "user_id is invalid" });
    return;
  }

  pool
    .query('DELETE FROM "AutoDetailing"."Users" WHERE user_id = $1', [
      request.params.id,
    ])
    .then((res) => response.status(200).json({ status: "success" }))
    .catch((err) => response.status(500).json({ status: "failed" }));
};

exports.addRole = (request, response) => {
  if (!request?.body) {
    response
      .status(400)
      .json({ status: "failed", reason: "missing payload for role assigning" });
    return;
  }

  if (
    !request?.body?.user_id ||
    isNaN(request?.body?.user_id) ||
    request?.body?.user_id < 0
  ) {
    response
      .status(404)
      .json({ status: "failed", reason: "user_id is invalid" });
    return;
  }

  if (
    !request?.body?.role_id ||
    isNaN(request?.body?.role_id) ||
    request?.body?.role_id < 0
  ) {
    response
      .status(404)
      .json({ status: "failed", reason: "role_id is invalid" });
    return;
  }

  pool
    .query(
      'INSERT INTO "AutoDetailing"."UserRole" (user_id, role_id) VALUES ($1, $2)',
      [request.body.user_id, request.body.role_id]
    )
    .then((res) => response.status(200).json({ status: "success" }))
    .catch((err) =>
      response.status(500).json({ status: "failed", reason: err.detail })
    );
};

exports.removeRole = (request, response) => {
  if (!request?.body) {
    response
      .status(400)
      .json({ status: "failed", reason: "missing payload for role assigning" });
    return;
  }

  if (
    !request?.body?.user_id ||
    isNaN(request?.body?.user_id) ||
    request?.body?.user_id < 0
  ) {
    response
      .status(404)
      .json({ status: "failed", reason: "user_id is invalid" });
    return;
  }

  if (
    !request?.body?.role_id ||
    isNaN(request?.body?.role_id) ||
    request?.body?.role_id < 0
  ) {
    response
      .status(404)
      .json({ status: "failed", reason: "role_id is invalid" });
    return;
  }

  pool
    .query(
      'DELETE FROM "AutoDetailing"."UserRole" WHERE user_id = $1 AND role_id = $2',
      [request.body.user_id, request.body.role_id]
    )
    .then((res) => response.status(200).json({ status: "success" }))
    .catch((err) =>
      response.status(500).json({ status: "failed", reason: err.detail })
    );
};

exports.login = async (request, response) => {
  if (!request.body) {
    response
      .status(400)
      .json({ status: "failed", reason: "missing payload for login" });
    return;
  }

  if (!request.body.email) {
    response
      .status(400)
      .json({ status: "failed", reason: "user_email is invalid" });
    return;
  }

  if (!request.body.password) {
    response
      .status(400)
      .json({ status: "failed", reason: "user_password is invalid" });
    return;
  }

  const result = await pool
    .query('SELECT * FROM "AutoDetailing"."Users" WHERE user_email = $1', [
      request.body.email,
    ])
    .then((res) => res.rows)
    .catch((err) => response.status(500).json({ status: "failed" }));

  if (result.length === 0) {
    response.status(400).json({ status: "failed", reason: "user not found" });
    return;
  }

  if (result?.is_guest) {
    response
      .status(500)
      .json({ status: "failed", reason: "guest users cannot login" });
    return;
  }

  const passwordMatches = await bcrypt.compare(
    request.body.password,
    result[0].user_password
  );

  if (!passwordMatches) {
    response
      .status(401)
      .json({ status: "failed", reason: "provided password is incorrect" });
    return;
  }

  const accessToken = AuthUtils.generateAccessToken({
    user: request.body.username,
  });
  const refreshToken = AuthUtils.generateRefreshToken({
    user: request.body.username,
  });

  let user = [];

  // omit password in response
  for (const [key, value] of Object.entries(result)) {
    if (key !== "user_password") user[key] = value;
  }

  response.status(200).json({
    status: "success",
    user: user,
    accessToken: accessToken,
    refreshToken: refreshToken,
  });
};
