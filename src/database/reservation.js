const pool = require("./connection");

/**
 * @typedef Reservation
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
 * @typedef ReservationCreate
 * @type Object
 * @property {BigInt} userId    用户ID
 * @property {BigInt} houseId   房屋ID
 * @property {Date} startDate   起始日期
 * @property {Date} endDate     终止日期
 * @property {string} status    预约状态
 * @property {string?} details  预约备注
 */

/**
 * @typedef ReservationUpdate
 * @type Object
 * @property {Date?} startDate  起始日期
 * @property {Date?} endDate    终止日期
 * @property {string?} status   预约状态
 * @property {string?} details  预约备注
 */

const reservation = {

    /**
     *
     * @param {ReservationCreate} reservationInfo
     * @return {Promise<{success: boolean, message: string}>}
     */
    create(reservationInfo) {
        return new Promise((resolve, reject) => {
            resolve({
                success: false,
                message: "Not Supported",
            });
        });
    },

    /**
     *
     * @param {BigInt} id
     * @param {ReservationUpdate} reservationInfo
     * @return {Promise<{success: boolean, message: string}>}
     */
    update(id, reservationInfo) {
        return new Promise((resolve, reject) => {
            resolve({
                success: false,
                message: "Not Supported",
            });
        });
    },

    /**
     *
     * @param {BigInt} id
     * @return {Promise<{success: boolean, message: string}>}
     */
    delete(id) {
        return new Promise((resolve, reject) => {
            resolve({
                success: false,
                message: "Not Supported",
            });
        });
    },
};

module.exports = reservation;
