const express = require("express");
const router = express.Router();
const database = require("../database");
const validator = require("../assets/validator");

router.use((req, res, next) => {
    console.log(req.method, "/houseSrc" + req.url);
    next();
});

router.get("/get-list", async (req, res) => {
    const {count, page} = req.query;
    if (!validator.isPositiveInteger(count, page)) {
        res.status(400).json({
            success: false,
            msg: "Empty count or page are not allowed",
        });
        return;
    }

    const {success, houseList} = await database.houseSrc.getList(count, (page - 1) * count);
    if (success) {

    }

    res.json({
        success,
        houseList,
        msg: "Get house list successfully",
    });
});

router.post("/create-house", async (req, res) => {
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

module.exports = router;
