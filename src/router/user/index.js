const express = require("express");
const router = express.Router();
const database = require("../../database");
const validator = require("../../assets/validator");

router.use(function user(req, res, next) {
    console.log(req.method, "/user" + req.url);
    next();
});

/**
 * 响应当前登录用户的用户信息
 * 要求credentials
 */
router.get("/get-info", function getInfo(req, res) {
    const {username, access} = req.session;
    res.json({
        username: username, access: access || "Not logged",
    });
});

/**
 * 处理用户登录请求
 * 设置cookie记录session标识符
 */
router.post("/login", async function login(req, res) {
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
        req.session.username = info.username;
        req.session.access = "user";
        res.json({
            msg: "Login succeed",
            success: true,
        });
    }
});

/**
 * 处理用户注销请求
 * 删除记录了session标识符的cookie
 */
router.get("/logout", function logout(req, res) {
    req.session.destroy((err) => {
        if (err) console.error(err);
    });
    res.json({
        success: true,
        msg: "Logout succeed",
    });
});

/**
 * 注册新用户
 * 要求请求体包含username和password
 */
router.post("/register", async function register(req, res) {
    const {username, password} = req.body;
    const {success, message} = await database.user.create(username, password);
    res.json({
        success,
        msg: message,
    });
});

// TODO 用户更新个人数据
router.post("/update-info", function updateInfo(req, res) {
    res.json({
        success: false,
        msg: "Not Supported",
    });
});

// TODO 用户删除个人账户
router.post("/delete-account", function deleteAccount(req, res) {
    res.json({
        success: false,
        msg: "Not Supported",
    });
});

router.get("/get-explore-list", async function getExploreList(req, res) {
    const {count, page} = req.query;
    if (!validator.isPositiveInteger(count, page)) {
        res.status(400).json({
            success: false,
            msg: "Empty count or page are not allowed",
        });
        return;
    }

    const {success, houseList} = await database.houseSrc.getList(count, (page - 1) * count);
    res.json({
        success,
        houseList,
        msg: "Get house list successfully",
    });
});


module.exports = router;
