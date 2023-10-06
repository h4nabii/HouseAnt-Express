(async () => {
    console.log("--- 数据库测试 ---");
    const database = require("../../src/database");

    const username = "用户";
    const password = "密码";

    console.log("> 创建用户测试");
    let {message: msgC} = await database.user.create(username, password);
    console.log(msgC);

    console.log("> 获取用户信息");
    let {userInfo} = await database.user.getInfo(username);
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
    userInfo = (await database.user.getInfo(newUsername)).userInfo;
    console.log(userInfo);

    console.log("> 删除用户测试");
    let {message: msgD} = await database.user.delete(userInfo.id);
    console.log(msgD);

    database.close();
})();
