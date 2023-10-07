const pool = require("./connection");

/**
 * @typedef User 用户信息
 * @type Object
 * @property {BigInt} id            用户ID
 * @property {string} username      用户名称
 * @property {string} password      用户密码
 * @property {string?} avatarUrl    用户头像URL
 * @property {string} access        用户权限
 * @property {Date} createTime      创建时间
 * @property {Date} updateTime      更新时间
 */

/**
 * @typedef UserUpdate 可以修改的用户字段
 * @type Object
 * @property {string?} username     用户名称
 * @property {string?} password     用户密码
 * @property {string?} avatarUrl    用户头像URL
 * @property {string?} access       用户权限
 */

const user = {

    /**
     * 获取数据库数据总量
     * @return {Promise<{success: boolean, count: number}>}
     */
    getTotal() {
        const queryStr = `
            select count(*) as count
            from user;
        `;
        return new Promise((resolve, reject) => {
            pool.query(queryStr, (err, [result]) => {
                if (err) reject(err);
                else resolve({
                    success: true,
                    count: result["count"],
                });
            });
        });
    },

    /**
     * 获取一定数量的用户数据
     * @param {number?} count 需要获取的数据总数
     * @param {number?} ignore 忽略数据个数
     * @return {Promise<Array<User>>} 用户列表
     */
    getList(count = 20, ignore) {
        const queryStr = `
            select *
            from user
            limit ${ignore ? (ignore + ",") : ""}
            ${count};
        `;
        return new Promise((resolve, reject) => {
            pool.query(queryStr, (err, results) => {
                if (err) reject(err);
                else resolve({
                    success: true,
                    userList: results,
                });
            });
        });
    },

    /**
     * 根据用户名称获取特定的用户信息
     * @param {string} username 用户名称
     * @return {Promise<{success: boolean, userInfo: User}>} 用户存在则`userInfo`为用户信息，否则为`undefined`
     */
    getInfoByName(username) {
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
     * @param {string} username 用户名
     * @param {string} password 用户密码
     * @return {Promise<{success: boolean, message: string}>} 执行结果
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
                    message: "Empty username or password",
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
     * @param {BigInt} userId 用户ID
     * @return {Promise<{success: boolean, message: string}>} 删除结果
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
     * @param {BigInt} userId 用户ID
     * @param {UserUpdate} newInfo 新的用户信息
     * @return {Promise<{success: boolean, message: string}>} 更新结果
     */
    update(userId, newInfo) {
        // TODO: 传入规定以外的数据依然可以修改其他数据，需要限制
        let keys = [];
        for (let [k, v] of Object.entries(newInfo)) keys.push(`${k}='${v}'`);

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
