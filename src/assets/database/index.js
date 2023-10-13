module.exports = {
    user: require("./user"),
    houseSrc: require("./houseSrc"),
    reservation: require("./reservation"),
    close() {
        require("./connection").end();
    },
};
