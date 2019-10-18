const Schema = require('mongoose').Schema;
const mongooseJobs = require('../../../model/mongoose/jobs');
const mongooseCompanies = require('../../../model/mongoose/companies');
const errors = require('../../services/errors');
const auth = require('../../middleware/auth-v2');
const enumerations = require('../../../model/enumerations');

module.exports.request = {
    type: 'post',
    path: '/jobs/'
};

const querySchema = new Schema({
    admin: Boolean,
    company_id: String
});

const bodySchema = new Schema({
    name: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: enumerations.jobStatus
        default: "open"
    },
    work_type : {
        type: String,
        enum: enumerations.workTypes
        required: true
    },
    location: {
        type: [{
            city: {
                type : Schema.Types.ObjectId,
                ref: 'Cities'
            },
            name: String,
            remote: Boolean,

        }],
        required: true
    },
    visa_needed: {
        type: Boolean,
        default:false
    },
    job_type: {
        type: [{
            type: String,
            enum: enumerations.employmentTypes
        }]
    },
    position: {
        type: [{
            type: String,
            required : true,
            enum: enumerations.workRoles
        }],
        required: true
    },
    expected_salary_min: {
        type: Number,
        min: 0
        required: true
    },
    expected_salary_max: {
        type: Number,
        min: 0
    },
    num_people_desired: {
        type:Number,
        required: true,
        min: 0
    },
    required_skills: {
        type:[new Schema({
            skills_id: {
                type : Schema.Types.ObjectId,
                ref: 'Skills'
            },
            type: String,
            name: String,
            exp_year: Number
        })]
    },
    not_required_skills: {
        type:[new Schema({
            skills_id: {
                type : Schema.Types.ObjectId,
                ref: 'Skills'
            },
            type: String,
            name: String,
        })]
    },
    description : {
        type : String,
        maxlength: 3000
    },
    created : {
        type : Date,
        required: true
    },
    modified : {
        type : Date,
        required: true
    }
});

module.exports.inputValidation = {
    query: querySchema,
    body: bodySchema
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
    const timestamp = new Date();

    let newJobDoc = req.body;
    newJobDoc.company_id = company_id;
    newJobDoc.created = timestamp;
    newJobDoc.modified = timestamp;

    const jobDoc = await mongooseJobs.insert(newJobDoc);

    res.send(jobDoc)
}