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
 * @typedef UserEditable 可修改的用户信息
 * @type Object
 * @property {string?} username      用户名称
 * @property {string?} password      用户密码
 * @property {string?} avatarUrl    用户头像URL
 * @property {string?} access        用户权限
 */

const user = {

    /**
     * 获取用户总数
     * @return {Promise<{success: boolean, count: number}>} 用户总数
     */
    getTotal: () => new Promise((resolve, reject) => {
        const queryStr = `
            select count(*) as count
            from user;
        `;
        pool.query(queryStr, (err, [result]) => {
            if (err) reject(err);
            else resolve({
                success: true,
                count: result["count"],
            });
        });
    }),

    /**
     * 获取一定数量的用户数据
     * @param {number} count=20 需要获取的数据数量
     * @param {number?} ignore 需要忽略的数据数量
     * @return {Promise<{success: boolean, userList: Array<User>}>} 用户列表
     */
    getList: (count = 20, ignore) => new Promise((resolve, reject) => {
        const queryStr = `
            select *
            from user
            limit ${ignore ? (ignore + ",") : ""}
            ${count};
        `;
        pool.query(queryStr, (err, results) => {
            if (err) reject(err);
            else resolve({
                success: true,
                userList: results,
            });
        });
    }),

    /**
     * 根据用户名称获取特定的用户信息
     * @param {string} username 用户名称
     * @return {Promise<{success: boolean, userInfo: User}>} 用户存在则userInfo为用户信息，否则为undefined
     */
    getByName(username) {
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
     * @param {string} username 用户名称
     * @param {string} password 用户密码
     * @return {Promise<{success: boolean, message: string}>} 创建用户结果信息
     */
    create: (username, password) => new Promise(async (resolve, reject) => {
        if (!username || !password) {
            resolve({
                success: false,
                message: "Empty username or password",
            });
            return;
        }

        try {
            const {success} = await user.getByName(username);
            if (success) {
                resolve({
                    success: false,
                    message: "Username already existed",
                });
            }
        } catch (err) {
            reject(err);
        }

        const queryStr = `
            insert into user(username, password)
            values ('${username}', '${password}')
        `;
        pool.query(queryStr, err => {
            if (err) reject(err);
            else resolve({
                success: true,
                message: "Create user successfully",
            });
        });
    }),

    /**
     * 根据用户 ID 删除用户
     * @param {BigInt} userId 用户ID
     * @return {Promise<{success: boolean, message: string}>} 删除结果
     */
    delete: (userId) => new Promise((resolve, reject) => {
        const queryStr = `
            delete
            from user
            where id = ?
        `;
        pool.query(queryStr, [userId], (err, results) => {
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
    }),

    /**
     * 根据用户 ID 更新用户信息
     * @param {BigInt} userId 用户ID
     * @param {UserEditable} newInfo 新的用户信息
     * @return {Promise<{success: boolean, message: string}>} 更新结果
     */
    update: (userId, {
        username,
        password,
        avatarUrl,
        access,
    }) => new Promise((resolve, reject) => {

        const fields = [];
        for ([k, v] of Object.entries({username, password, avatarUrl, access}))
            if (v) fields.push(`${k}='${v}'`);

        let queryStr = [
            `update user set`,
            fields.join(", "),
            `where id = ${userId}`,
        ].join(" ");

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
    }),
};

module.exports = user;
