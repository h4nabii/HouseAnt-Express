const express = require("express");
const router = express.Router();
const database = require("../../database");

// TODO 管理员获取用户列表
router.get("/get-explore-list", function getList(req, res) {
    res.json({
        success: false,
        msg: "Not Supported",
    });
});

// TODO 管理员封禁特定账户
router.post("/ban", function ban(req, res) {
    res.json({
        success: false,
        msg: "Not Supported",
    });
});

module.exports = router;
