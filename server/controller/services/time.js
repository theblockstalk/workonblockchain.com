module.exports.now = function now() {
    return Date.now();
};

module.exports.sleep = async function sleep(ms){
    return new Promise(resolve => {
        setTimeout(resolve, ms)
    })
}