const mongoose = require('mongoose');
const companySchema = require('../schemas/companies');
const jobs = require('../mongoose/jobs');
const defaultMongoose = require('../defaultMongoose');

let Model = mongoose.model('CompanyProfile', companySchema);
let cities = require('./cities');

let mongooseFunctions = defaultMongoose(Model);

mongooseFunctions.findOne = async function (selector) {
    return await Model.findOne(selector).populate('_creator').lean();
}

mongooseFunctions.findOneById = async function (id) {
    return await Model.findById(id).populate('_creator').lean();
}

mongooseFunctions.findOneByUserId = async function (id) {
    return await Model.findOne({_creator: id}).populate('_creator').lean();
}

mongooseFunctions.findOneAndPopulate = async function (id) {
    let companyDoc = await Model.findOne({_creator: id}).populate('_creator').lean();
    if(companyDoc && companyDoc.job_ids) {
        for (let i = 0; i < companyDoc.job_ids.length; i++) {
            const jobDoc = await jobs.findOneById(companyDoc.job_ids[i]);
            if (jobDoc.locations) {
                for (let j = 0; j < jobDoc.locations; j++) {
                    const cityDoc = await cities.findOneById(jobDoc.locations[j].city);
                    jobDoc.locations[j].city = cityDoc
                }
            }
            companyDoc.job_ids[i] = jobDoc;
        }
    }

    return companyDoc;

}

// TODO: need to change this to updateOne()
mongooseFunctions.update = async function (selector, updateObj) {
    await Model.findOneAndUpdate(selector, updateObj, { runValidators: true });
}

mongooseFunctions.updateMany = async function (selector, updateObj) {
    await Model.updateMany(selector, updateObj, { runValidators: true });
}

mongooseFunctions.aggregate = async function (searchQuery) {
    return await Model.aggregate([{
        $lookup:
            {
                from: "users",
                localField: "_creator",
                foreignField: "_id",
                as: "users"
            }
    }, searchQuery]);
}

module.exports = mongooseFunctions;