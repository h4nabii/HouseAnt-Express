const pool = require("./connection");
const user = require("./user");

/**
 * @typedef House 房屋信息
 * @type Object
 * @property {BigInt} id        房屋ID
 * @property {string} hostName  房主名称
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
 * @typedef HouseRequired 必须的房屋信息
 * @type Object
 * @property {string} hostName  房主名称
 * @property {string} name      房屋名称
 * @property {string} address   房屋地址
 * @property {number} price     房屋价格
 * @property {string?} details  详细信息
 * @property {number?} area     房屋面积
 * @property {string?} picture  图片URL
 */

/**
 * @typedef HouseEditable 可修改的房屋信息
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
     * 获取房屋总数
     * @return {Promise<{success: boolean, count: number}>} 房屋总数
     */
    getTotal: () => new Promise((resolve, reject) => {
        const queryStr = `
            select count(*) as count
            from houseSrc;
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
     * 获取一定数量的房屋数据
     * @param {number} count=20 需要获取的房屋数量
     * @param {number?} ignore 需要忽略的房屋数量
     * @return {Promise<{success: boolean, houseList: Array<House>}>} 房屋列表
     */
    getList: (count = 20, ignore) => new Promise((resolve, reject) => {
        const queryStr = `
            select id,
                   (select username
                    from user
                    where userId = id) as hostName,
                   name,
                   address,
                   price,
                   details,
                   area,
                   picture,
                   createTime,
                   updateTime
            from houseSrc
            limit ${ignore ? (ignore + ",") : ""}
            ${count};
        `;
        pool.query(queryStr, (err, results) => {
            if (err) reject(err);
            else resolve({
                success: true,
                houseList: results,
            });
        });
    }),

    /**
     * 获取空闲的房屋总数
     * @return {Promise<{success: boolean, count: number}>} 房屋总数
     */
    getAvailableTotal: () => new Promise((resolve, reject) => {
        const queryStr = `
            select count(*) as count
            from houseSrc
            where id in (select houseId from reservation where status = 'reserved');
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
     * 获取一定数量的空闲的房屋数据
     * @param {number?} count 需要获取的房屋数量
     * @param {number?} ignore 需要忽略的房屋数量
     * @return {Promise<{success: boolean, houseList: Array<House>}>} 房屋列表
     */
    getAvailableList: (count = 20, ignore) => new Promise((resolve, reject) => {
        const queryStr = `
            select id,
                   (select username
                    from user
                    where userId = id) as hostName,
                   name,
                   address,
                   price,
                   details,
                   area,
                   picture,
                   createTime,
                   updateTime
            from houseSrc
            where id in (select houseId from reservation where status = 'reserved')
            limit ${ignore ? (ignore + ",") : ""}
            ${count};
        `;
        pool.query(queryStr, (err, results) => {
            if (err) reject(err);
            else resolve({
                success: true,
                houseList: results,
            });
        });
    }),

    /**
     * 根据房屋ID获取特定的房屋信息
     * @param {BigInt} houseId 房屋ID
     * @return {Promise<{success: boolean, houseInfo: House}>} 房屋存在则houseInfo为房屋信息，否则为undefined
     */
    getById: (houseId) => new Promise((resolve, reject) => {
        const queryStr = `
            select id,
                   (select username
                    from user
                    where userId = id) as hostName,
                   name,
                   address,
                   price,
                   details,
                   area,
                   picture,
                   createTime,
                   updateTime
            from houseSrc
            where id = '${houseId}';
        `;
        pool.query(queryStr, (err, [result]) => {
            if (err) reject(err);
            else resolve({
                success: !!result,
                houseInfo: result,
            });
        });
    }),

    /**
     * 根据房主ID获取房主的所有房屋
     * @param {BigInt} userId
     * @return {Promise<{success: boolean, houseList: Array<House>}>}
     */
    getListByOwnerId: (userId) => new Promise((resolve, reject) => {
        const queryStr = `
            select id,
                   (select username
                    from user
                    where userId = id) as username,
                   name,
                   address,
                   price,
                   details,
                   area,
                   picture,
                   createTime,
                   updateTime
            from houseSrc
            where userId = '${userId}';
        `;
        pool.query(queryStr, (err, results) => {
            if (err) reject(err);
            else resolve({
                success: true,
                houseList: results,
            });
        });
    }),

    /**
     * 创建一个新的房屋
     * @param {HouseRequired} houseInfo 房屋信息
     * @return {Promise<{success: boolean, message: string}>} 执行结果
     */
    create: (houseInfo) => new Promise(async resolve => {
        const {
            hostName,
            name,
            address,
            price,
            details,
            area,
            picture,
        } = houseInfo;

        const {success, userInfo: {id: userId}} = await user.getByName(hostName);
        if (!success) {
            resolve({
                success: false,
                message: "User not exist",
            });
            return;
        }

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
    }),

    /**
     * 根据房屋ID删除房屋
     * @param {BigInt} houseId - 房屋ID
     * @return {Promise<{success: boolean, message: string}>} - 删除结果
     */
    delete: (houseId) => new Promise((resolve, reject) => {
        const queryStr = `
            delete
            from houseSrc
            where id = ${houseId}
        `;
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
    }),

    /**
     * 根据房屋ID更新房屋信息
     * @param {BigInt} houseId 房屋ID
     * @param {HouseEditable} newInfo 新信息
     * @return {Promise<{success: boolean, message: string}>} 更新结果
     */
    update: (houseId, newInfo) => new Promise((resolve, reject) => {
        const {
            name,
            address,
            price,
            details,
            area,
            picture,
        } = newInfo;

        const fields = [];
        for ([k, v] of Object.entries({name, address, price, details, area, picture}))
            if (v) fields.push(`${k}='${v}'`);

        let queryStr = [
            `update houseSrc set`,
            fields.join(", "),
            `where id = ${houseId}`,
        ].join(" ");

        pool.query(queryStr, (err, results) => {
            if (err) reject(err);
            else {
                if (results.affectedRows) {
                    resolve({
                        success: true,
                        message: "Update house successfully",
                    });
                } else {
                    resolve({
                        success: false,
                        message: `House with id "${houseId}" is not exist`,
                    });
                }
            }
        });
    }),
};

module.exports = houseSrc;
