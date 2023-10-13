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
const indexRouter = require("./router/index");

// Configurations
const corsConfig = require("./assets/data/corsConfig");
const sessionConfig = require("./assets/data/sessionConfig");

const app = express();
const port = 7070;

app.use(cors(corsConfig));
app.use(session(sessionConfig));
app.use(express.json());

app.use((req, res, next) => {
    // Catch request IP and time
    const time = new Date();
    const ip = req.ip.split(":").map(i => i.padStart(3, " ")).join(":");
    console.log(`>>> [${time.toLocaleString()}] Request from ${ip}  ---  ${req.method} ${req.url}`);
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
    console.log(`now listening on http://localhost:${port}`);
});
