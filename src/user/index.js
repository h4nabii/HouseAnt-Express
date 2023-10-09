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
        username: username, access: access || "Not Logged",
    });
});

router.post("/login", async (req, res) => {
    const {username, password} = req.body;
    let info, err;
    if (username) {
        ({userInfo: info} = await database.user.getByName(username));
        console.log(info);
        if (info) {
            if (info.password !== password) {
                err = "Wrong Password";
            }
        } else {
            err = "User Not Exist";
        }
    } else {
        err = "Empty Username";
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
            msg: "Login Succeed",
            success: true,
        });
    }
});

router.get("/logout", (req, res) => {
    req.session.destroy((err) => {
        if (err) console.error(err);
    });
    res.end("Logout Succeed");
});

router.post("/register", (req, res) => {
    const {username, password} = req.body;
    database.user.create(username, password)
        .then(() => {
            res.send("success");
        })
        .catch(() => {
            res.send("failed");
        });
});

router.get("/jsonp", (req, res) => {
    const callbackName = req.query["callback"] || "callback";
    const serverData = "Server Data";
    res.send(`
    if (typeof ${callbackName} === "function") ${callbackName}(${JSON.stringify({
        data: serverData,
    })});
    else console.log("Server: callback not exist");
    `);
});

module.exports = router;
