module.exports.now = function () {
    return Date.now();
};

module.exports.sleep = async function (ms){
    return new Promise(resolve => {
        setTimeout(resolve, ms)
    })
}

module.exports.addSeconds = function (date, secondsIncrement) {
    date.setSeconds(date.getSeconds()+secondsIncrement);
};