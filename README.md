## HouseAnt - Express

![Static Badge](https://img.shields.io/badge/status-developing-red)

使用 Express 编写的网页后端

### 项目依赖

| Package         | 功能             |
|-----------------|----------------|
| mysql           | 数据库连接          |
| express         | 服务器            |
| express-session | 实现浏览器Session登录 |
| cors            | 实现跨域资源共享       |


### 项目初始化

1. 下载依赖

```shell
npm install
```

2. 配置数据库连接和 Session 密钥

`/src/database/config.js`：
```javascript
module.exports = {
    host: "主机地址（IP或域名）",
    user: "用户名",
    // 需要使用 Standard 密码，即 mysql_native_password
    password: "密码", 
    database: "数据库名"
}
```

`/src/sessionSecret.js`：
```javascript
/** @type string */
module.exports = "密钥";
```

### 启动项目
```shell
npm start
```

### 测试
数据库测试
```shell
npm run test-database
```
