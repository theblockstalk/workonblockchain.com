module.exports.now = function now() {
    return Date.now();
};

module.exports.sleep = function sleep(ms){
    return new Promise(resolve => {
        setTimeout(resolve, ms)
    })
}