const secret = require("./sessionSecret");
module.exports = {
    secret,
    resave: false,
    saveUninitialized: false,
    cookie: {
        domain: process.env.COOKIE_DOMAIN,
        maxAge: 30 * 60 * 1000,
        httpOnly: true,
    },
    name: "server",
    rolling: true,
};
