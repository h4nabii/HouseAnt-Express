const pool = require("./connection");

/**
 * @typedef User - 用户信息
 * @type Object
 * @property {BigInt} id - 用户ID
 * @property {string} username - 用户名称
 * @property {string} password - 用户密码
 * @property {string} avatarUrl - 用户头像URL
 * @property {string} access - 用户权限
 * @property {Date} createTime - 创建时间
 * @property {Date} updateTime - 更新时间
 */

/**
 * @typedef UserUpdate - 可以修改的用户字段
 * @type Object
 * @property {string?} username - 用户名称
 * @property {string?} password - 用户密码
 * @property {string?} avatarUrl - 用户头像URL
 * @property {string?} access - 用户权限
 */

const user = {

    /**
     * 根据用户名称获取特定的用户信息
     * @param username - 用户名称
     * @return {Promise<{success: boolean, userInfo: User}>} - 用户存在则 `userInfo` 为用户信息，否则为 `undefined`
     */
    getInfo(username) {
        const queryStr = `
            select *
            from user
            where username = '${username}';
        `;
        return new Promise((resolve, reject) => {
            pool.query(queryStr, (err, [result]) => {
                if (err) reject(err);
                else resolve({
                    success: !!result,
                    userInfo: result,
                });
            });
        });
    },

    /**
     * 创建一个新的用户
     * @param username - 用户名
     * @param password - 用户密码
     * @return {Promise<{success: boolean, message: string}>} - 执行结果
     */
    create(username, password) {
        const queryStr = `
            insert into user(username, password)
            values ('${username}', '${password}')
        `;
        return new Promise(resolve => {
            if (!username || !password) {
                resolve({
                    success: false,
                    message: "Empty username and password",
                });
                return;
            }
            pool.query(queryStr, err => {
                if (err) resolve({
                    success: false,
                    message: "SQL error occurred: " + err.sqlMessage,
                });
                else resolve({
                    success: true,
                    message: "Create user successfully",
                });
            });
        });
    },

    /**
     * 根据用户 ID 删除用户
     * @param {BigInt} userId - 用户ID
     * @return {Promise<{success: boolean, message: string}>} - 删除结果
     */
    delete(userId) {
        const queryStr = `
            delete
            from user
            where id = ${userId}
        `;
        return new Promise((resolve, reject) => {
            pool.query(queryStr, (err, results) => {
                if (err) reject(err);
                else {
                    if (results.affectedRows) {
                        resolve({
                            success: true,
                            message: "Delete user successfully",
                        });
                    } else {
                        resolve({
                            success: false,
                            message: `User with id "${userId}" is not exist`,
                        });
                    }
                }
            });
        });
    },

    /**
     * 根据用户 ID 更新用户信息
     * @param {BigInt} userId - 用户ID
     * @param {UserUpdate} newData - 新的用户信息
     * @return {Promise<{success: boolean, message: string}>} - 更新结果
     */
    update(userId, newData) {
        let keys = [];
        for (let [k, v] of Object.entries(newData)) keys.push(`${k}='${v}'`);

        let queryStr = [
            "update user set",
            keys.join(", "),
            `where id = ${userId}`,
        ].join(" ");

        return new Promise((resolve, reject) => {
            pool.query(queryStr, (err, results) => {
                if (err) reject(err);
                else {
                    if (results.affectedRows) {
                        resolve({
                            success: true,
                            message: "Update user successfully",
                        });
                    } else {
                        resolve({
                            success: false,
                            message: `User with id "${userId}" is not exist`,
                        });
                    }
                }
            });
        });
    },
};

module.exports = user;
