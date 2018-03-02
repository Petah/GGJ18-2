module.exports = class Logger {
    constructor(fileName) {
        this.fileName = fileName;
    }

    log(...args) {
        console.log(this.fileName, ...args);
    }
};
