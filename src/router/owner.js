const express = require("express");
const router = express.Router();
const database = require("../assets/database");
const validator = require("../assets/js/validator");

router.post("/add-house", async function addHouse(req, res) {
    const {username} = req.session;
    if (!username) {
        res.status(400).json({
            success: false,
            msg: "Not logged",
        });
        return;
    }

    const {success: userExist} = await database.user.getByName(username);
    if (!userExist) {
        res.status(400).json({
            success: false,
            msg: "User not exist",
        });
        return;
    }

    const {
        name,
        address,
        price,
        details,
        area,
        picture,
    } = req.body;
    if ((!name || !address || !validator.isPositiveNumber(price))
        // || !(area && validator.isPositiveNumber(area))
    ) {
        res.status(400).json({
            success: false,
            msg: "Insufficient or invalid parameters",
        });
        return;
    }

    const {success, message} = await database.houseSrc.create({
        hostName: username,
        name,
        address,
        price,
        details,
        area,
        picture,
    });

    res.json({
        success,
        msg: message,
    });
});

/**
 * 房主更新自己的房屋信息
 */
router.post("/update-house", async function updateHouse(req, res) {
    const {success, message} = await database.houseSrc.update(req.body["id"], {
        ...req.body,
    });

    res.json({
        success,
        msg: message,
    });
});

/**
 * 房主删除自己的房屋
 */
router.post("/remove-house", async function removeHouse(req, res) {
    const {success, message} = await database.houseSrc.delete(req.body["id"]);

    res.json({
        success,
        msg: message,
    });
});

/**
 * 房主获取自己所有的房屋信息
 */
router.get("/get-house-list",async  function getHouseList(req, res) {
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

    const {success, houseList} = await database.houseSrc.getListByOwnerId(userInfo.id);
    res.json({
        success,
        houseList,
        msg: "Get house list successfully",
    });
});

module.exports = router;
