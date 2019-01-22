const users = require('../model/mongoose/users');
const candidateProfile = require('../model/mongoose/candidate');
const Referral = require('../model/referrals');
const mongoose = require('mongoose');
const logger = require('../controller/services/logger');

let totalDocsToProcess, totalModified = 0, totalProcessed = 0;
const csvFilePath='C:\\Users\\DELL\\Downloads\\worldcities - processed.csv';
const csv=require('csvtojson');
csv()
    .fromFile(csvFilePath)
    .then((jsonObj) => {
})

module.exports.up = async function() {
    const jsonArray=await csv().fromFile(csvFilePath);
    console.log(jsonArray);
    console.log("up");
}

module.exports.down = async function() {


}