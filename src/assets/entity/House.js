class House {
    #id;
    #userId;

    /**
     *
     * @param {BigInt} id
     * @param {BigInt} userId
     * @param {string} name
     * @param {string} address
     * @param {number} price
     * @param {string?} details
     * @param {number?} area
     * @param {string?} picture
     */
    constructor({id, userId, name, address, price, details, area, picture}) {
        this.#id = id;
        this.#userId = userId;
        this.name = name;
        this.address = address;
        this.price = price;
        this.details = details;
        this.area = area;
        this.picture = picture;
    }

    get id() {
        return this.#id;
    }

    set id(_) {
        throw new Error("House.id are not settable");
    }

    get userId() {
        return this.#userId;
    }

    set userId(_) {
        throw new Error("House.userId are not settable");
    }
}
