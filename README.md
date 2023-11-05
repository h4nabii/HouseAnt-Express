## HouseAnt - Express

![](https://img.shields.io/badge/Deployed_OS-Ubuntu_22.04.3_LTS-blue)
![](https://img.shields.io/badge/Developing-red)

![](https://img.shields.io/badge/Database-MySQL_8.0.35-blue)
![](https://img.shields.io/badge/Server-Express_4.18.2-blue)

模拟租房网站 HouseAnt 的后端服务器代码，使用 Express 框架

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
