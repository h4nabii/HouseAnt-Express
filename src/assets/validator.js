function isPositiveInteger(...args) {
    for (let arg of args) {
        arg = +arg;
        if (!Number.isInteger(arg)) {
            return false;
        }
    }
    return true;
}

function isPositiveNumber(...args) {
    for (let arg of args) {
        arg = +arg;
        if (!Number.isFinite(arg)) {
            return false;
        }
    }
    return true;
}

module.exports = {
    isPositiveInteger,
    isPositiveNumber,
};
