module.exports = class User {
    #id;

    /**
     * @param {BigInt} id           用户ID
     * @param {string} username     用户名称
     * @param {string} password     用户密码
     * @param {string?} avatarUrl    用户头像URL
     * @param {string} access       用户权限
     */
    constructor({id, username, password, avatarUrl, access}) {
        this.#id = id;
        this.username = username;
        this.password = password;
        this.avatarUrl = avatarUrl;
        this.access = access;
    }

    get id() {
        return this.#id;
    }

    set id(_) {
        throw new Error("User.id are not settable");
    }
};
