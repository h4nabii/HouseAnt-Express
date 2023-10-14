const express = require("express");
const router = express.Router();
router.get("/", (req, res) => {
    if (process.env.HOUSEANT_MODE === "production")
        res.redirect("/house-ant/public/test.html");
    else {
        res.redirect("/public/test.html")
    }
});

router.get("/jsonp", function jsonp(req, res) {
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
