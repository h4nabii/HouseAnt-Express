const express = require("express");
const router = express.Router();
const database = require("../assets/database");

/**
 * 顾客获取自己的所有预约信息
 * 需要credentials
 */
router.get("/get-reservation-list", async function getReservationList(req, res) {
    const username = req.session["username"];
    if (!username) {
        res.status(400).json({
            success: false,
            msg: "Not logged",
        });
        return;
    }

    const {success: userExist, userInfo} = await database.user.getByName(username);
    if (!userExist) {
        res.status(400).json({
            success: false,
            msg: "User not exist",
        });
        return;
    }

    const userId = userInfo.id;
    const {success, reservationList} = await database.reservation.getListByUserId(userId);

    res.json({
        success,
        reservations: reservationList,
    });
});

/**
 * 顾客创建预约
 * 需要credentials
 */
router.post("/create-reservation", async function createReservation(req, res) {
    const username = req.session["username"];
    const {userExist, userInfo} = await database.user.getByName(username);

    // User does not exist
    if (!userExist) {
        res.status(401).json({
            success: false,
            msg: "User does not exist",
        });
        return;
    }

    const userId = userInfo.id;
    const {success, message} = await database.reservation.create({
        userId,
        ...req.body,
    });

    res.json({
        success,
        msg: message,
    });
});

/**
 * 顾客修改自己的预约信息
 */
router.post("/modify-reservation", async function modifyReservation(req, res) {
    const {success, message} = await database.reservation.update(req.body["id"], {
        ...req.body,
    });

    res.json({
        success,
        msg: message,
    });
});

/**
 * 顾客取消自己的预约
 */
router.post("/cancel-reservation", async function cancelReservation(req, res) {
    const {success, message} = await database.reservation.delete(req.body["id"]);

    res.json({
        success,
        msg: message,
    });
});

module.exports = router;
