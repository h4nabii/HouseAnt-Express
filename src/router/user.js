const express = require("express");
const router = express.Router();
const database = require("../assets/database");
const validator = require("../assets/js/validator");

/**
 * 响应当前登录用户的用户信息
 * 要求credentials
 */
router.get("/get-info", function getInfo(req, res) {
    const {username, access} = req.session;
    res.json({
        username: username,
        access: access || "Not logged",
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
            err = "User does not exist";
        }
    } else {
        err = "Empty username";
    }

    if (err) {
        res.json({
            success: false,
            msg: err,
        });
    } else {
        req.session.username = info.username;
        req.session.access = "user";
        res.json({
            success: true,
            msg: "Login succeed",
        });
    }
});

/**
 * 处理用户注销请求
 * 删除记录了session标识符的cookie
 */
router.get("/logout", function logout(req, res) {
    req.session.destroy((err) => {
        if (err) {
            console.error(err);
            res.status(500).json({
                success: false,
                msg: "Internal Server Error",
            });
        } else {
            res.json({
                success: true,
                msg: "Logout succeed",
            });
        }
    });
});

/**
 * 注册新用户
 * 要求请求体包含username和password
 */
router.post("/register", async function register({body: {username, password}}, res) {
    if (!username || !password) {
        res.status(400).json({
            success: false,
            msg: "Please provide username and password",
        });
        return;
    }

    const {success, message} = await database.user.create(username, password);
    res.json({
        success,
        msg: message,
    });
});

/**
 * 更新用户信息
 * 要求credentials
 */
router.post("/update-info", async function updateInfo(req, res) {
    const username = req.session["username"];
    const newData = req.body;
    const {success: userExist, userInfo} = await database.user.getByName(username);

    // User does not exist
    if (!userExist) {
        res.status(401).json({
            success: false,
            msg: "User does not exist",
        });
        return;
    }

    const userId = userInfo.id;
    const {success, message} = await database.user.update(userId, newData);

    res.json({
        success,
        msg: message,
    });
});

// TODO 用户删除个人账户 (需要处理外键约束，删除账户时应确保同时删除其他数据)
// router.post("/delete-account", async function deleteAccount(req, res) {
//     const username = req.session["username"];
//     console.log(username);
//     const {success: userExist, userInfo} = await database.user.getByName(username);
//
//     // User does not exist
//     if (!userExist) {
//         res.status(401).json({
//             success: false,
//             msg: "User does not exist",
//         });
//         return;
//     }
//
//     const userId = userInfo.id;
//     const {success, message} = await database.user.delete(userId);
//     res.json({
//         success,
//         msg: message,
//     });
// });

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
