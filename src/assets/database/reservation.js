const pool = require("./connection");

/**
 * @typedef Reservation 预约信息
 * @type Object
 * @property {BigInt} id        预约ID
 * @property {BigInt} userId    用户ID
 * @property {BigInt} houseId   房屋ID
 * @property {Date} startDate   起始日期
 * @property {Date} endDate     终止日期
 * @property {string} status    预约状态
 * @property {string?} details  预约备注
 * @property {Date} createTime  创建时间
 * @property {Date} updateTime  更新时间
 */

/**
 * @typedef ReservationRequired 必须的预约信息
 * @type Object
 * @property {BigInt} userId    用户ID
 * @property {BigInt} houseId   房屋ID
 * @property {Date} startDate   起始日期
 * @property {Date} endDate     终止日期
 * @property {string} status    预约状态
 * @property {string?} details  预约备注
 */

/**
 * @typedef ReservationEditable 可修改的预约信息
 * @type Object
 * @property {Date?} startDate  起始日期
 * @property {Date?} endDate    终止日期
 * @property {string?} status   预约状态
 * @property {string?} details  预约备注
 */

const reservation = {
    /**
     * 获取预约总数
     * @return {Promise<{success: boolean, count: number}>} 预约总数
     */
    getTotal: () => new Promise((resolve, reject) => {
        const queryStr = `
            select count(*) as count
            from reservation;
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
     * 获取一定数量的预约列表
     * @param {number} count=20 需要获取的预约数量
     * @param {number?} ignore 需要忽略的预约数量
     * @return {Promise<{success: boolean, reservationList: Array<Reservation>}>} 预约列表
     */
    getList: (count = 20, ignore) => new Promise((resolve, reject) => {
        const queryStr = `
            select *
            from reservation
            limit ${ignore ? (ignore + ",") : ""}
            ${count};
        `;
        pool.query(queryStr, (err, results) => {
            if (err) reject(err);
            else resolve({
                success: true,
                reservationList: results,
            });
        });
    }),

    /**
     * 根据房屋ID获取房屋的所有预约记录
     * @param {BigInt} houseId 房屋ID
     * @return {Promise<{success: boolean, reservationList: Array<Reservation>}>} 预约列表
     */
    getListByHouseId: (houseId) => new Promise((resolve, reject) => {
        const queryStr = `
            select *
            from reservation
            where houseId = ${houseId}
        `;
        pool.query(queryStr, (err, results) => {
            if (err) reject(err);
            else resolve({
                success: true,
                reservationList: results,
            });
        });
    }),

    /**
     * 根据用户ID获取用户的所有预约记录
     * @param {BigInt} userId 用户ID
     * @return {Promise<{success: boolean, reservationList: Array<Reservation>}>} 预约列表
     */
    getListByUserId: (userId) => new Promise((resolve, reject) => {
        const queryStr = `
            select *
            from reservation
            where userId = ${userId}
        `;
        pool.query(queryStr, (err, results) => {
            if (err) reject(err);
            else resolve({
                success: true,
                reservationList: results,
            });
        });
    }),

    /**
     * 创建预约
     * @param {ReservationRequired} reservationInfo 预约信息
     * @return {Promise<{success: boolean, message: string}>} 创建结果
     */
    create: ({
        userId,
        houseId,
        startDate,
        endDate,
        status,
        details,
    }) => new Promise(resolve => {
        const queryStr = `
            insert into reservation(userid, houseId, startDate, endDate, status
                ${details ? ", details" : ""})
            values (${userId},
                    ${houseId},
                    ${pool.escape(startDate)},
                    ${pool.escape(endDate)},
                    '${status}'
                        ${details ? ",'" + details + "'" : ""});
        `;
        if (!userId || !houseId || !startDate || !endDate || !status) {
            resolve({
                success: false,
                message: "Fields \"userId\", \"houseId\", \"startDate\", \"endDate\", \"status\" cannot be \"undefined\" or \"null\"",
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
     * 删除预约
     * @param {BigInt} id 预约ID
     * @return {Promise<{success: boolean, message: string}>} 删除结果
     */
    delete: (id) => new Promise((resolve, reject) => {
        const queryStr = `
            delete
            from reservation
            where id = ${id}
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
                        message: `House with id "${id}" is not exist`,
                    });
                }
            }
        });
    }),

    /**
     * 更新预约数据
     * @param {BigInt} id 预约ID
     * @param {ReservationEditable} newInfo 更新信息
     * @return {Promise<{success: boolean, message: string}>} 更新结果
     */
    update: (id, {
        startDate,
        endDate,
        status,
        details,
    }) => new Promise((resolve, reject) => {

        const fields = [];
        for ([k, v] of Object.entries({startDate, endDate, status, details}))
            if (v) fields.push(`${k}=${pool.escape(v)}`);

        let queryStr = [
            `update reservation set`,
            fields.join(", "),
            `where id = ${id}`,
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
                        message: `House with id "${id}" is not exist`,
                    });
                }
            }
        });
    }),
};

module.exports = reservation;
