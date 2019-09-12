const mongoose = require('mongoose');
const companySchema = require('../schemas/companies');
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
    if(companyDoc) {
        if(companyDoc.saved_searches ) {
            for(let i =0; i < companyDoc.saved_searches.length ; i++) {
                if(companyDoc.saved_searches[i].location && companyDoc.saved_searches[i].location.length > 0) {
                    for(let loc of companyDoc.saved_searches[i].location) {
                        if(loc.city) {
                            const index = companyDoc.saved_searches[i].location.findIndex((obj => obj.city === loc.city));
                            const citiesDoc = await cities.findOneById(loc.city);
                            companyDoc.saved_searches[i].location[index].city = citiesDoc;
                        }
                    }
                }
            }

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