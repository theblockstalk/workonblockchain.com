const users = require('../../../../model/mongoose/users');
const filterReturnData = require('../filterReturnData');
const errors = require('../../../services/errors');
const citites = require('../../../../model/mongoose/cities');

module.exports = async function (req, res) {
    const myUserDoc = req.auth.user;
    if(String(myUserDoc._id) === req.params._id || myUserDoc.is_admin === 1) {
        const candidateDoc = await users.findOneById(req.params._id);
        if(candidateDoc) {
            const filterData = filterReturnData.removeSensativeData(candidateDoc);
            if(candidateDoc.candidate.locations) {
                for(let loc of candidateDoc.candidate.locations) {
                    if(loc.city) {
                        const index = candidateDoc.candidate.locations.findIndex((obj => obj.city === loc.city));
                        const citiesDoc = await citites.findOneById(loc.city);
                        candidateDoc.candidate.locations[index].city = citiesDoc.city;
                    }
                }
            }

            res.send(filterData);

        }
        else {
            errors.throwError("User not found", 404);
        }
    }
    else {
        errors.throwError("Authentication failed", 400);
    }
}