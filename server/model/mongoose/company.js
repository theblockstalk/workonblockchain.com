let Company = require('../employer_profile');
let cities = require('./cities');

module.exports.insert = async function insert(data) {
    let newDoc = new Company(data);

    await newDoc.save();

    return newDoc._doc;
}

module.exports.findOne = async function findOne(selector) {
    return await Company.findOne(selector).populate('_creator').lean();
}

module.exports.findOneById = async function findOneById(id) {
    return await Company.findById(id).populate('_creator').lean();
}

module.exports.findOneByUserId = async function findOneByUserId(id) {
    return await Company.findOne({_creator: id}).populate('_creator').lean();
}

module.exports.findOneAndPopulate = async function findOneAndPopulate(id) {
    let companyDoc = await Company.findOne({_creator: id}).populate('_creator').lean();
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

module.exports.update = async function (selector, updateObj) {
    await Company.findOneAndUpdate(selector, updateObj, { runValidators: true });
}


module.exports.updateMany = async function (selector, updateObj) {
    await Company.updateMany(selector, updateObj, { runValidators: true });
}

module.exports.deleteOne = async function deleteOne(selector) {
    await Company.find(selector).remove();
}

module.exports.count = async function count(selector) {
    return new Promise((resolve, reject) => {
        try {
            Company.count(selector, (err1, result) => {
                if (err1) reject(err1);
                resolve(result);
            })
        } catch (err2) {
            reject(err2);
        }
    })
}

module.exports.findWithCursor = async function findWithCursor(selector) {
    return await Company.find(selector).populate('_creator').cursor();
}

module.exports.findAndIterate = async function findAndIterate(selector, fn) {
    let cursor = await this.findWithCursor(selector);
    let doc = await cursor.next();

    for (null; doc !== null; doc = await cursor.next()) {
        await fn(doc);
    }
}