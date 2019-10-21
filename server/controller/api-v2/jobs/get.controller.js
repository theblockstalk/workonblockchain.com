const Schema = require('mongoose').Schema;
const jobs = require('../../../model/mongoose/jobs');
const companies = require('../../../model/mongoose/companies');
const auth = require('../../middleware/auth-v2');
const errors = require('../../services/errors');

module.exports.request = {
    type: 'get',
    path: '/jobs'
};

const querySchema = new Schema({
    admin: Boolean,
    company_id: String,
    job_id: String
});

module.exports.inputValidation = {
    query: querySchema
};

module.exports.auth = async function (req) {
    await auth.isLoggedIn(req);
    if (req.query.admin)  await auth.isAdmin(req);
    else  await auth.isCompanyType(req);
}

module.exports.endpoint = async function (req, res) {
    let company_id;
    if (req.query.admin) {
        company_id = req.query.company_id
    }
    else {
        const companyDoc = await companies.findOne({_creator: req.auth.user._id});
        company_id = companyDoc._id
    }
    const jobId = req.query.job_id;

    const jobDoc = await jobs.findOneById(jobId);
    if (jobDoc.company_id !== company_id)
        errors.throwError("Not authorized to get this job", 400);

    res.send(jobDoc)
}