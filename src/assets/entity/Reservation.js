class Reservation {
    #id;
    #userId;
    #houseId;

    /**
     *
     * @param {BigInt} id
     * @param {BigInt} userId
     * @param {BigInt} houseId
     * @param {Date} startDate
     * @param {Date} endDate
     * @param {string} status
     * @param {string?} details
     */
    constructor({id, userId, houseId, startDate, endDate, status, details}) {
        this.#id = id;
        this.#userId = userId;
        this.#houseId = houseId;
        this.startDate = startDate;
        this.endDate = endDate;
        this.status = status;
        this.details = details;
    }

    get id() {
        return this.#id;
    }

    set id(_) {
        throw new Error("Reservation.id are not settable");
    }

    get userId() {
        return this.#userId;
    }

    set userId(_) {
        throw new Error("Reservation.userId are not settable");
    }

    get houseId() {
        return this.#houseId;
    }

    set houseId(_) {
        throw new Error("Reservation.houseId are not settable");
    }
}
