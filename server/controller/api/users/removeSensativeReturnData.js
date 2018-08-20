module.exports = function removeSensativeReturnData(returnData) {
    delete returnData.password;
    return returnData;
}