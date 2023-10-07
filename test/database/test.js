(async () => {
    console.log("--- 数据库测试 ---");
    const database = require("../../src/database");

    const userTest = async () => {
        console.log(">>> 用户表测试");

        const username = "用户";
        const password = "密码";

        console.log("> 创建用户测试");
        let {message: msgC} = await database.user.create(username, password);
        console.log(msgC);

        console.log("> 获取用户信息");
        let {userInfo} = await database.user.getInfoByName(username);
        console.log(userInfo);

        console.log("> 更新用户信息");
        const newUsername = "新用户";
        const newPassword = "新密码";
        let {message: msgU} = await database.user.update(BigInt(userInfo.id), {
            username: newUsername,
            password: newPassword,
        });
        console.log(msgU);

        console.log("> 获取用户信息");
        userInfo = (await database.user.getInfoByName(newUsername)).userInfo;
        console.log(userInfo);

        console.log("> 删除用户测试");
        let {message: msgD} = await database.user.delete(userInfo.id);
        console.log(msgD);

        console.log(await database.user.getList(20, 2));
        console.log(await database.user.getTotal());
    };

    const houseTest = async () => {
        console.log(">>> 房屋表测试");

        const {userInfo: {id: ownerId}} = await database.user.getInfoByName("房主");

        /** @type HouseCreate */
        const newHouseInfo = {
            userId: ownerId,
            name: "测试房屋",
            address: "位置",
            price: 2333,
            picture: "12312",
        };

        const {success, message} = await database.houseSrc.create(newHouseInfo);
        console.log(success, message);

        const {houseList: [{id: id1}, {id: id2}]} = await database.houseSrc.getInfoListByOwnerId(ownerId);

        const updateInfo = {
            ...newHouseInfo,
            picture: "1241sda",
        };

        console.log(await database.houseSrc.update(id1, updateInfo));
        console.log(await database.houseSrc.delete(id2));
    };

    // await userTest();
    await houseTest();
    database.close();
})();
