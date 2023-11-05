require("dotenv").config();

// Libraries
const path = require("node:path");
const express = require("express");
const session = require("express-session");
const cors = require("cors");

// Routers
const userRouter = require("./router/user");
const ownerRouter = require("./router/owner");
const customerRouter = require("./router/customer");
const adminRouter = require("./router/admin");
const indexRouter = require("./router");

// Configurations
const corsConfig = require("./assets/data/corsConfig");
const sessionConfig = require("./assets/data/sessionConfig");

const app = express();
const port = process.env.SERVER_PORT;

app.use(cors(corsConfig));
app.use(session(sessionConfig));
app.use(express.json());

app.use((req, res, next) => {
    // Catch request IP and time
    const time = new Date();
    const ip = (req.headers["x-forwarded-for"] || req.headers["x-real-ip"] || req.hostname || "unknown").padStart(15, " ");
    console.log(`>>> [${time.toLocaleString()}] Request from ${ip} --- ${req.method} ${req.url}`);
    next();
});

app.use("/", indexRouter);
app.use("/public", express.static(path.join(__dirname, "public")));
app.use("/admin", adminRouter);
app.use("/user", userRouter);
app.use("/owner", ownerRouter);
app.use("/customer", customerRouter);

app.listen(port, () => {
    console.log(`last update 23.10.14`);
    if (process.env.HOUSEANT_MODE === "production") {
        console.log(`Product port on : https://h4nabii.hyhyzz.top/house-ant/`);
        console.log(`Front end on    : https://blog.hyhyzz.top/HouseAnt-Vue3/`);
    } else {
        console.log(`Develop port on : http://localhost:${port}/`);
    }
});
