const pool = require("./connection");

/**
 * @typedef House 用户信息
 * @type Object
 * @property {BigInt} id        房屋ID
 * @property {BigInt} userId    房主ID
 * @property {string} name      房屋名称
 * @property {string} address   房屋地址
 * @property {number} price     房屋价格
 * @property {string?} details  详细信息
 * @property {number?} area     房屋面积
 * @property {string?} picture  图片URL
 * @property {Date} createTime  创建时间
 * @property {Date} updateTime  更新时间
 */

/**
 * @typedef HouseCreate 创建房屋所需的字段
 * @type Object
 * @property {BigInt} userId    房主ID
 * @property {string} name      房屋名称
 * @property {string} address   房屋地址
 * @property {number} price     房屋价格
 * @property {string?} details  详细信息
 * @property {number?} area     房屋面积
 * @property {string?} picture  图片URL
 */

/**
 * @typedef HouseUpdate 可以修改的房屋字段
 * @type Object
 * @property {string?} name     房屋名称
 * @property {string?} address  房屋地址
 * @property {number?} price    房屋价格
 * @property {string?} details  详细信息
 * @property {number?} area     房屋面积
 * @property {string?} picture  图片URL
 */

const houseSrc = {

    /**
     * 根据房屋ID获取特定的房屋信息
     * @param {BigInt} houseId 房屋ID
     * @return {Promise<{success: boolean, houseInfo: House}>} 房屋存在则 `houseInfo` 为用户信息，否则为 `undefined`
     */
    getInfoById(houseId) {
        const queryStr = `
            select *
            from houseSrc
            where id = '${houseId}';
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
     *
     * @param {number} userId
     * @return {Promise<{success: boolean, houseList: Array<House>}>}
     */
    getInfoListByOwnerId(userId) {
        const queryStr = `
            select *
            from houseSrc
            where userId = '${userId}';
        `;
        return new Promise((resolve, reject) => {
            pool.query(queryStr, (err, results) => {
                if (err) reject(err);
                else resolve({
                    success: true,
                    houseList: results,
                });
            });
        });
    },

    /**
     * 创建一个新的房屋
     * @param {HouseCreate} houseInfo 房屋信息
     * @return {Promise<{success: boolean, message: string}>} 执行结果
     */
    create(houseInfo) {
        const {userId, name, address, price, details, area, picture} = houseInfo;
        const queryStr = `
            insert into houseSrc(userid, name, address, price
                ${details ? ", details" : ""} ${area ? ", area" : ""}
                ${picture ? ", picture" : ""})
            values (${userId},
                    '${name}',
                    '${address}',
                    '${price}'
                        ${details ? ",'" + details + "'" : ""}
                        ${area ? ",'" + area + "'" : ""}
                        ${picture ? ",'" + picture + "'" : ""});
        `;
        console.log(queryStr);
        return new Promise(resolve => {
            if (!userId || !name || !address || !price) {
                resolve({
                    success: false,
                    message: "Fields \"userId\", \"name\", \"address\", \"price\" cannot be \"undefined\" or \"null\"",
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
                    message: "Create house successfully",
                });
            });
        });
    },

    /**
     * 根据房屋ID删除房屋
     * @param {BigInt} houseId - 房屋ID
     * @return {Promise<{success: boolean, message: string}>} - 删除结果
     */
    delete(houseId) {
        const queryStr = `
            delete
            from houseSrc
            where id = ${houseId}
        `;
        return new Promise((resolve, reject) => {
            pool.query(queryStr, (err, results) => {
                if (err) reject(err);
                else {
                    if (results.affectedRows) {
                        resolve({
                            success: true,
                            message: "Delete house successfully",
                        });
                    } else {
                        resolve({
                            success: false,
                            message: `House with id "${houseId}" is not exist`,
                        });
                    }
                }
            });
        });
    },

    /**
     * 根据用户 ID 更新用户信息
     * @param {BigInt} houseId 房屋ID
     * @param {HouseUpdate} newHouseInfo - 新信息
     * @return {Promise<{success: boolean, message: string}>} - 更新结果
     */
    update(houseId, newHouseInfo) {
        // TODO: 传入规定以外的数据依然可以修改其他数据，需要限制
        let keys = [];
        for (let [k, v] of Object.entries(newHouseInfo)) keys.push(`${k}='${v}'`);

        let queryStr = [
            "update houseSrc set",
            keys.join(", "),
            `where id = ${houseId}`,
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
                            message: `User with id "${houseId}" is not exist`,
                        });
                    }
                }
            });
        });
    },
};

module.exports = houseSrc;
