const mysql = require("mysql");

/**
 * 敏感数据，请更改为自己的数据库配置
 * @type Object
 * @property {string} host - 主机地址
 * @property {string} user - 用户
 * @property {string} password - 密码
 * @property {string} database - 库名
 */
const config = require("./config");
const maxConnection = 20;

const pool = mysql.createPool({
    ...config,
    connectionLimit: maxConnection,
});

module.exports = pool;
