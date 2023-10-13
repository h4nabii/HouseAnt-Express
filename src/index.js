// Libs
const path = require("node:path");
const express = require("express");
const session = require("express-session");
const cors = require("cors");

// Routers
const userRouter = require("./router/user");
const ownerRouter = require("./router/owner");
const customerRouter = require("./router/customer");
const adminRouter = require("./router/admin");

// Data
const secret = require("./sessionSecret");

const app = express();
const port = 7070;

// allowOriginPattern("*") & allowCredentials(true) in Spring
app.use(cors({
    origin: true,
    credentials: true,
}));
app.use(session({
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        domain: "hyhyzz.top",
        maxAge: 30 * 60 * 1000,
    },
    name: "server",
    rolling: true,
}));
app.use(express.json());

app.use("/public", express.static(path.join(__dirname, "public")));
app.use("/admin", adminRouter);
app.use("/user", userRouter);
app.use("/owner", ownerRouter);
app.use("/customer", customerRouter);

app.use((req, res, next) => {
    console.log(`req from ${req.ip}, ${new Date()}`);
    next();
});

app.get("/", (req, res) => {
    let resTxt;
    console.log(resTxt = JSON.stringify({
        query: req.query, body: req.body, cookie: req.cookies,
    }));
    res.send(resTxt);
});

app.get("/jsonp", function jsonp(req, res) {
    const callbackName = req.query["callback"] || "callback";
    const serverData = "Server data";
    res.send(`
    if (typeof ${callbackName} === "function") ${callbackName}(${JSON.stringify({
        data: serverData,
    })});
    else console.log("Server: callback not exist");
    `);
});

app.listen(port, () => {
    console.log(`last update 23.10.13`);
    console.log(`now listening on http://localhost:${port}`);
});
