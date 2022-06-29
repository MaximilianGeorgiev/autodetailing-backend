const req = require("express/lib/request");
const jwt = require("jsonwebtoken");

/* 
    Refresh tokens are passed to the user so they can request a new access token once
    theirs expires. That's why they are stored in this array and if the user has the correct
    refresh token they will get a new access token. Then the refresh token is removed, a new one is 
    generated and stored and sent to the user for further use.
*/
let refreshTokens = [];

exports.generateAccessToken = (user) => {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15m" })
};

exports.generateRefreshToken = (user) => {
    const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "20m" });
    refreshTokens.push(refreshToken);
    return refreshToken;
};

exports.refreshToken = (request, response) => {
    if (!request?.body) {
        response.status(400).json({ status: "failed", reason: "missing refresh token" });
        return;
    }

    if (!request.body?.token) {
        response.status(400).json({ status: "failed", reason: "missing refresh token" });
        return;
    }

    if (!request.body?.username) {
        response.status(400).json({ status: "failed", reason: "username is invalid" });
        return;
    }

    console.log(JSON.stringify(refreshTokens))

    if (!refreshTokens.includes(request.body.token)) {
        response.status(400).json({ status: "failed", reason: "invalid refresh token" });
        return;
    }

    // invalidate old refresh token
    refreshTokens = refreshTokens.filter((c) => c != request.body.token);

    const accessToken = this.generateAccessToken({ user: request.body.username })
    const refreshToken = this.generateRefreshToken({ user: request.body.username })

    response.json({ accessToken: accessToken, refreshToken: refreshToken })
};

exports.removeToken = (request, response) => {
    if (!request?.body) {
        response.status(400).json({ status: "failed", reason: "missing refresh token" });
        return;
    }

    if (!request.body?.token) {
        response.status(400).json({ status: "failed", reason: "missing refresh token" });
        return;
    }

    refreshTokens = refreshTokens.filter((c) => c != request.body.token)
    response.status(200).json({ status: "success" })
};

exports.validateToken = (request, response, next) => {
    if (request.headers["authorization"] === undefined) {
        response.status(400).json({ status: "failed", reason: "no authorization header provided" });
    }

    const token = request.headers["authorization"].split(" ")[1]; // jwt token is: `Bearer <token>`

    if (token === null) {
        response.status(400).json({ status: "failed", reason: "no token provided" });
        return;
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
            response.status(403).json({ status: "failed", reason: "invalid token" });
            return;
        }

        request.user = user;
        next(); // next function call in call chain
    });
};