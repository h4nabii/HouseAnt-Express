// Libs
const path = require("node:path");
const express = require("express");
const session = require("express-session");
const cors = require("cors");

// Routers
const userRouter = require("./user");
const houseRouter = require("./houseSrc");

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
        maxAge: 30 * 60 * 1000,
        httpOnly: false,
    },
    name: "server",
}));
app.use(express.json());

app.use("/public", express.static(path.join(__dirname, "public")));
app.use("/user", userRouter);
app.use("/house-source", houseRouter);

app.get("/", (req, res) => {
    let resTxt;
    console.log(resTxt = JSON.stringify({
        query: req.query, body: req.body, cookie: req.cookies,
    }));
    res.send(resTxt);
});

app.listen(port, () => {
    console.log(`now listening on http://localhost:${port}`);
});
