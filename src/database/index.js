module.exports = {
    user: require("./user"),
    close() {
        require("./connection").end();
    },
};
