let User = require('../users');
let cities = require('./cities');

module.exports.insert = async function insert(data) {
    let newDoc = new User(data);

    await newDoc.save();

    return newDoc._doc;
}

module.exports.findAndSort = async function find(selector, sort) {
    return await User.find(selector).sort(sort).lean();
}

module.exports.find = async function find(selector) {
    return await User.find(selector).lean();
}

module.exports.findOne = async function findOne(selector) {
    return await User.findOne(selector).lean();
}

module.exports.findOneById = async function findOneById(id) {
    return await User.findById(id).lean();
}

module.exports.findByIdAndPopulate = async function findByIdAndPopulate(id) {
    let userDoc = await User.findById(id).lean();
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

module.exports.findOneByEmail = async function findOneByEmail(email) {
    return await User.findOne({email: email}).lean();
}

module.exports.update = async function update(selector, updateObj) {
    await User.findOneAndUpdate(selector, updateObj, { runValidators: true });
}

module.exports.deleteOne = async function deleteOne(selector) {
    await User.find(selector).remove();
}

module.exports.count = async function count(selector) {
    return new Promise((resolve, reject) => {
        try {
            User.count(selector, (err1, result) => {
            if (err1) reject(err1);
    resolve(result);
})
} catch (err2) {
        reject(err2);
    }
})
}

module.exports.findWithCursor = async function findWithCursor(selector) {
    return await User.find(selector).cursor();
}

module.exports.findAndIterate = async function findAndIterate(selector, fn) {
    let cursor = await this.findWithCursor(selector);
    let doc = await cursor.next();

    for (null; doc !== null; doc = await cursor.next()) {
        await fn(doc);
    }
}