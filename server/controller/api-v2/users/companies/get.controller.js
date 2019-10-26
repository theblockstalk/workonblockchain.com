const auth = require('../../../middleware/auth-v2');
const Schema = require('mongoose').Schema;
const companies = require('../../../../model/mongoose/companies');
const Users = require('../../../../model/mongoose/users');
const errors = require('../../../services/errors');
const filterReturnData = require('../filterReturnData');
const objects = require('../../../services/objects');

module.exports.request = {
    type: 'get',
    path: '/users/companies'
};

const querySchema = new Schema({
    user_id: String,
    admin: {
        type: String,
        enum: ['true']
    }
});

module.exports.inputValidation = {
    query: querySchema
}

module.exports.auth = async function (req) {
    await auth.isLoggedIn(req);
    if(req.query.admin) await auth.isAdmin(req);
}

module.exports.endpoint = async function (req, res) {
    let userId;
    if(req.query.admin) userId = req.query.user_id;
    else userId = req.auth.user._id;

    const employerProfile = await companies.findOneAndPopulate(userId);
    if (employerProfile) {
        const employerProfileRemovedData = filterReturnData.removeSensativeData(objects.copyObject(employerProfile._creator));
        let employerCreatorRes = employerProfile;
        employerCreatorRes._creator = employerProfileRemovedData;

        if(employerCreatorRes._creator.referred_email) {
            const userDoc = await Users.findOne({email: employerCreatorRes._creator.referred_email});
            if(userDoc) {
                employerCreatorRes.user_id = userDoc._id;
                employerCreatorRes.user_type = userDoc.type;
                if (userDoc.type === 'company') {
                    const employerDoc = await companies.findOne({_creator: userDoc._id});
                    if (employerDoc.first_name) employerCreatorRes.name = employerDoc.first_name + ' ' + employerDoc.last_name;
                }
                else {
                    if (userDoc.first_name) employerCreatorRes.name = userDoc.first_name + ' ' + userDoc.last_name;
                }
            }
        }
        let jobs = employerCreatorRes.job_ids;
        if (jobs && jobs.length > 0) {
            jobs.sort(function (job1, job2) {
                if (statusToNum(job1.status) > statusToNum(job2.status)) {
                    return -1;
                } else if (statusToNum(job1.status) < statusToNum(job2.status)) {
                    return 1;
                } else {
                    if (job1.created > job1.created) {
                        return -1;
                    } else {
                        return 1;
                    }
                }
            })
        }
        res.send(employerCreatorRes);
    }
    else errors.throwError("Company doc not found", 404);
}

const statusToNum = function (status) {
    switch (status) {
        case "open":
            return 2;
        case "paused":
            return 1;
        case "closed":
            return 0;
    }
}