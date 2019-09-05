const mongoose = require('mongoose');
const userSchema = require('../schemas/users');
const defaultMongoose = require('../defaultMongoose');
let cities = require('./cities');

let Model = mongoose.model('User', userSchema);

let mongooseFunctions = defaultMongoose(Model);

mongooseFunctions.findAndSort = async function find(selector, sort) {
    return await Model.find(selector).sort(sort).lean();
}

mongooseFunctions.find = async function find(selector) {
    return await Model.find(selector).lean();
}

mongooseFunctions.findByIdAndPopulate = async function findByIdAndPopulate(id) {
    let userDoc = await Model.findById(id).lean();
    if(userDoc) {
        if(userDoc.candidate ) {
            if(userDoc.candidate.employee) {
                if(userDoc.candidate.employee.location && userDoc.candidate.employee.location.length > 0) {
                    for(let loc of userDoc.candidate.employee.location) {
                        if(loc.city) {
                            const index = userDoc.candidate.employee.location.findIndex((obj => obj.city === loc.city));
                            const citiesDoc = await cities.findOneById(loc.city);
                            userDoc.candidate.employee.location[index].city = citiesDoc;
                        }
                    }
                }
            }

            if(userDoc.candidate.contractor) {
                if(userDoc.candidate.contractor.location && userDoc.candidate.contractor.location.length > 0) {
                    for(let loc of userDoc.candidate.contractor.location) {
                        if(loc.city) {
                            const index = userDoc.candidate.contractor.location.findIndex((obj => obj.city === loc.city));
                            const citiesDoc = await cities.findOneById(loc.city);
                            userDoc.candidate.contractor.location[index].city = citiesDoc;
                        }
                    }
                }
            }

            if(userDoc.candidate.volunteer) {
                if(userDoc.candidate.volunteer.location && userDoc.candidate.volunteer.location.length > 0) {
                    for(let loc of userDoc.candidate.volunteer.location) {
                        if(loc.city) {
                            const index = userDoc.candidate.volunteer.location.findIndex((obj => obj.city === loc.city));
                            const citiesDoc = await cities.findOneById(loc.city);
                            userDoc.candidate.volunteer.location[index].city = citiesDoc;
                        }
                    }
                }
            }
        }
    }

    return userDoc;

}

mongooseFunctions.findOneByEmail = async function findOneByEmail(email) {
    return await Model.findOne({email: email}).lean();
}

// TODO: need to change this to updateOne()
mongooseFunctions.update = async function update(selector, updateObj) {
    await Model.findOneAndUpdate(selector, updateObj);
}

module.exports = mongooseFunctions;