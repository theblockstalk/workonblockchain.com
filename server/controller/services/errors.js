module.exports.throwError = function throwError(message, code) {
    let error = new Error(message);
    if (code) {
        error.code = code;
    }
    throw error;
}