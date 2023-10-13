const secret = require("./sessionSecret");
module.exports = {
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        domain: "hyhyzz.top",
        maxAge: 30 * 60 * 1000,
    },
    name: "server",
    rolling: true,
};
