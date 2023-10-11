const express = require("express");
const router = express.Router();
const database = require("../database");

router.use((req, res, next) => {
    console.log(req.method, "/user" + req.url);
    next();
});

router.get("/get-info", (req, res) => {
    const {username, access} = req.session;
    res.json({
        username: username, access: access || "Not logged",
    });
});

router.post("/login", async (req, res) => {
    const {username, password} = req.body;
    let info, err;
    if (username) {
        ({userInfo: info} = await database.user.getByName(username));
        if (info) {
            if (info.password !== password) {
                err = "Wrong password";
            }
        } else {
            err = "User not exist";
        }
    } else {
        err = "Empty username";
    }

    if (err) {
        res.json({
            error: err, success: false,
        });
    } else {
        req.status = "Logged";
        req.session.username = info.username;
        req.session.access = "user";
        res.json({
            msg: "Login succeed",
            success: true,
        });
    }
});

router.get("/logout", (req, res) => {
    req.session.destroy((err) => {
        if (err) console.error(err);
    });
    res.end("Logout succeed");
});

router.post("/register", async (req, res) => {
    const {username, password} = req.body;
    const {success, message} = await database.user.create(username, password);
    res.json({
        success,
        msg: message,
    });
});

router.get("/jsonp", (req, res) => {
    const callbackName = req.query["callback"] || "callback";
    const serverData = "Server data";
    res.send(`
    if (typeof ${callbackName} === "function") ${callbackName}(${JSON.stringify({
        data: serverData,
    })});
    else console.log("Server: callback not exist");
    `);
});

module.exports = router;
