const express = require("express");
const router = express.Router();
const database = require("../../assets/database");

// TODO 顾客获取自己的所有预约信息
router.get("get-reservation-list", function getReservationList(req, res) {
    res.json({
        success: false,
        msg: "Not Supported",
    });
});

// TODO 顾客创建预约
router.post("create-reservation", function createReservation(req, res) {
    res.json({
        success: false,
        msg: "Not Supported",
    });
});

// TODO 顾客修改自己的预约信息
router.post("modify-reservation", function modifyReservation(req, res) {
    res.json({
        success: false,
        msg: "Not Supported",
    });
});

// TODO 顾客取消自己的预约
router.post("cancel-reservation", function cancelReservation(req, res) {
    res.json({
        success: false,
        msg: "Not Supported",
    });
});

module.exports = router;
